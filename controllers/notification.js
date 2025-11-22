const {getNotifications} = require('../service/notificationService');


//@desc     Get user notification
//@route    GET /api/v1/notification
//@access   Public
exports.getNotifications = async (req, res) => {
  try {
    const result = await getNotifications(req.user);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};