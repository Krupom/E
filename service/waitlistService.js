const Waitlist = require('../models/Waitlist');
const createError = require('http-errors');

exports.addWaitlist = async (userId, spaceId, reserveDate) => {
    try {
        console.log(userId, spaceId);
        const existwaitlist = await exports.getWaitlist(userId, spaceId, reserveDate);
        if(existwaitlist.length > 0) throw new createError(400, "You already in the waitlist");
        
        const waitlistEntry = await Waitlist.create({
            userId,
            spaceId,
            reserveDate
        });
        return waitlistEntry;
    } catch (err) {
        if (err.status) throw err;
        throw createError(500, 'Failed to add waitlist entry ');
    }
};

/*exports.getWaitlistBySpaceAndDate = async (spaceId, reserveDate) => {
    try {
        console.log("sdfg", spaceId, reserveDate);
        return await Waitlist.find({
            spaceId,
            reserveDate
        }).populate('userId', 'name email');
    } catch (err) {
        throw createError(500, 'Failed to fetch waitlist');
    }
};*/

exports.getWaitlist = async (userId, spaceId, reserveDate) => {
    try {
        const query = {};
        if (userId) query.userId = userId;
        if (spaceId) query.spaceId = spaceId;
        if (reserveDate) query.reserveDate = reserveDate;

        return await Waitlist.find(query).populate('userId', 'name email').populate('spaceId', 'name');
    } catch (err) {
        throw createError(500, 'Failed to fetch waitlist');
    }
};

/*exports.getWaitlists = async (user, spaceId = null) => {
    try {
        if (user.role !== 'admin') {
            query = Waitlist.find({ user: user.id });
        } else if (spaceId) {
            query = Waitlist.find({ spaceId });
        } else {
            query = Waitlist.find();
        }
        return query.populate({
            path: 'spaceId',
            select: 'name province tel openTime closeTime'
        });
    } catch (err) {
        throw createError(500, 'Failed to fetch user waitlists');
    }
};
*/
exports.removeWaitlistById = async (id) => {
    try {
        const result = await Waitlist.findByIdAndDelete(id);
        if (!result) throw createError(404, 'Waitlist entry not found');
        return result;
    } catch (err) {
        if (err.status) throw err;
        throw createError(500, 'Failed to remove waitlist entry');
    }
};

exports.pullNextWaitlist = async (spaceId, reserveDate) => {
    try {
        const next = await Waitlist.findOne({
            spaceId,
            reserveDate
        }).sort({ createdAt: 1 });

        if (!next) return null;

        await Waitlist.findByIdAndDelete(next._id);
        return next;
    } catch (err) {
        throw createError(500, 'Failed to pull next waitlist entry');
    }
};

exports.cancelUserWaitlist = async (userId, spaceId, reserveDate) => {
    try {
        const cancellist = await Waitlist.findOneAndDelete({
            userId,
            spaceId,
            reserveDate
        });
        if (!cancellist) throw createError(404, 'Waitlist entry not found for cancellation');
        return cancellist;
    } catch (err) {
        if (err.status) throw err;
        throw createError(500, 'Failed to cancel waitlist entry');
    }
};
