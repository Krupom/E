const Reservation = require('../models/Reservation');
const CoworkingSpace = require('../models/CoworkingSpace');
const User = require('../models/User');
const {sentNotification} = require('./notificationService')
const {pullNextWaitlist, addWaitlist, getWaitlist} = require('./waitlistService');
const createError = require('http-errors');

exports.getReservations = async (user, spaceId = null) => {
    let query;

    if (user.role !== 'admin') {
        query = Reservation.find({ userId: user.id });
    } else if (spaceId) {
        query = Reservation.find({ spaceId });
    } else {
        query = Reservation.find();
    }

    return query.populate({
        path: 'spaceId',
        select: 'name province tel openTime closeTime'
    });
};

exports.getReservation = async (id) => {
    const reservation = await Reservation.findById(id).populate({
        path: 'spaceId',
        select: 'name province tel openTime closeTime'
    });

    if (!reservation) throw createError(404, 'Reservation not found');
    return reservation;
};

exports.addReservation = async (user, spaceId, payload) => {
    if(user.role !== 'admin' || !payload.userId) payload.userId = user.id;
    payload.spaceId = spaceId;

    if(!payload.reserveDate){
        throw new createError(400, 'Plese specify reserve date');
    }

    const existedReservations = await Reservation.find({ userId:payload.userId });
    const existwaitlist = await getWaitlist(payload.userId);
    console.log(existwaitlist);
    if (existedReservations.length + existwaitlist.length >= 3 && user.role !== 'admin') {
        throw createError(400, 'User has already made 3 reservations');
    }

    const coworkingSpace = await CoworkingSpace.findById(spaceId);
    if (!coworkingSpace) {
        throw createError(404, 'No Co-working space found');
    } 
    const existsUserReserve = await Reservation.find({
        userId: payload.userId,
        spaceId,
        reserveDate: payload.reserveDate
    });
    if(existsUserReserve.length > 0) throw createError(400, 'You already reserve this place at this time');
    const existsSameDay = await Reservation.find({
        spaceId,
        reserveDate: payload.reserveDate
    });

    // Waitlist if full
    if (existsSameDay.length > 0) {
        const createWaitlist = await addWaitlist(payload.userId, spaceId, payload.reserveDate);
        // sent noti
        await sentNotification(
            payload.userId, 
            "Waitlist added", 
            `Your reservation on Date ${payload.reserveDate} at Co-working space ${coworkingSpace.name} by ${user.role} ${user.name} is full you have been added to waitlist`
        );
        return {message: `The slot on ${payload.reserveDate} is full. You've been added to waitlist`, Waitlist: createWaitlist}
    }

    const createdReserve = await Reservation.create(payload);
    await sentNotification(
        payload.userId, 
        "Reservation created", 
        `You reservation have beeen create on Date ${payload.reserveDate} at Co-working space ${coworkingSpace.name} by ${user.role} ${user.name}`
    );
    return createdReserve;
};

exports.updateReservation = async (id, user, payload) => {
    const reservation = await Reservation.findById(id).populate("spaceId"); 
    if (!reservation) throw createError(404, 'Reservation not found');
    console.log(reservation);

    if (reservation.userId.toString() !== user.id && user.role !== 'admin') {
        throw createError(401, 'Not authorized');
    }
    const updateReservation = Reservation.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
    });
    await sentNotification(
        reservation.userId, 
        "Reservation updated", 
        `You reservation have beeen updated on Date ${reservation.reserveDate} at Co-working space ${reservation.spaceId.name} by ${user.role} ${user.name}`
    );
    return updateReservation;
};

exports.deleteReservation = async (id, user) => {
    const reservation = await Reservation.findById(id).populate("spaceId");
    if (!reservation) throw createError(404, 'Reservation not found');
    console.log(reservation);
    if (reservation.userId.toString() !== user.id && user.role !== 'admin') {
        throw createError(401, 'Not authorized');
    }
    const spaceId = reservation.spaceId;
    const reserveDate = reservation.reserveDate;

    await Reservation.deleteOne({ _id: id });

    //get next waitlist
    const nextlist = await pullNextWaitlist(spaceId, reserveDate);

    //automatic add waitlist to reserve
    if(nextlist) {
        const user = await User.findById(nextlist.userId);
        if(user) await exports.addReservation(user, spaceId, {reserveDate});
    }
    await sentNotification(
        reservation.userId, 
        "Reservation deleted", 
        `You reservation have beeen deleted on Date ${reservation.reserveDate} at Co-working space ${reservation.spaceId.name} by ${user.role} ${user.name}`
    );

    return { success: true };
};
