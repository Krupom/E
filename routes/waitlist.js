const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    getWaitlists,
    removeWaitlistById,
    cancelUserWaitlist
} = require('../controllers/waitlist');

const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getWaitlists);

router.delete('/', protect, cancelUserWaitlist);

router.delete('/:id', protect, authorize('admin'), removeWaitlistById);

module.exports = router;
