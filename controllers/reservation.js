const {getReservation, getReservations, addReservation, updateReservation, deleteReservation} = require('../service/reservationService');

//@desc     Get all Reservations
//@route    GET /api/v1/reservations
//@access   Public / Admin
exports.getReservations = async (req, res) => {
  try {
    const { spaceId } = req.params;
    const reservations = await getReservations(req.user, spaceId);
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

//@desc     Get single Reservation
//@route    GET /api/v1/reservation/:id
//@access   Public / Admin
exports.getReservation = async (req, res) => {
  try {
    const reservation = await getReservation(req.params.id);
    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

//@desc     Add a reservation
//@route    POST /api/v1/space/:spaceId/reservations
//@access   Private
exports.addReservation = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const payload = req.body;

        const result = await addReservation(req.user, spaceId, payload);

        if (result.waitlist) {
            res.status(200).json({
                success: true,
                message: result.message,
                waitlist: result.waitlist
            });
        } else {
            res.status(201).json({
                success: true,
                data: result
            });
        }
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
//@desc     Update Reservation
//@route    PUT /api/v1/reservation/:id
//@access   Private
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await updateReservation(req.params.id, req.user, req.body);
    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

//@desc     Delete Reservation
//@route    DELETE /api/v1/reservation/:id
//@access   Private
exports.deleteReservation = async (req, res) => {
  try {
    const result = await deleteReservation(req.params.id, req.user);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};
