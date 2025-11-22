const express = require('express');
const {getNotifications} = require('../controllers/notification');

const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

router.route('/').get(protect, getNotifications);

module.exports = router;