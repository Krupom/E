const {getWaitlist, removeWaitlistById, cancelUserWaitlist} = require('../service/waitlistService');

//@desc     Get all waitlists for a user
//@route    GET /api/v1/waitlist
//@access   Private
exports.getWaitlists = async (req, res) => {
    try {
        const { spaceId } = req.params;
        let userId = req.body?.userId ?? undefined;
        const reserveDate = req.body?.reserveDate ?? undefined;
        if(req.user.role !== "admin") userId = user.id;

        const waitlists = await getWaitlist(userId, spaceId, reserveDate);

        res.status(200).json({ success: true, count: waitlists.length, data: waitlists });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

//@desc     Cancel a waitlist entry by userId, spaceId, reserveDate
//@route    DELETE /api/v1/space/:spaceId/waitlist
//@access   Private
exports.cancelUserWaitlist = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { reserveDate } = req.body;

        const cancelled = await cancelUserWaitlist(req.user.id, spaceId, reserveDate);
        res.status(200).json({ success: true, data: cancelled });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

//@desc     Remove waitlist entry by ID
//@route    DELETE /api/v1/waitlist/:id
//@access   Private / Admin
exports.removeWaitlistById = async (req, res) => {
    try {
        const removed = await removeWaitlistById(req.params.id);
        res.status(200).json({ success: true, data: removed });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};