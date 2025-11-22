const express = require('express');
const {getCoworkingSpace, getCoworkingSpaces, createCoworkingSpace, updateCoworkingSpace, deleteCoworkingSpace} = require('../controllers/coworkingSpace');

const reservationRouter = require('./reservation');
const waitlistRouter = require('./waitlist');

const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

router.use('/:spaceId/reservation', reservationRouter);
router.use('/:spaceId/waitlist', waitlistRouter);

router.route('/').get(getCoworkingSpaces).post(protect, authorize('admin'), createCoworkingSpace);
router.route('/:id').get(getCoworkingSpace).put(protect, authorize('admin'), updateCoworkingSpace).delete(protect, authorize('admin'), deleteCoworkingSpace);

module.exports = router;