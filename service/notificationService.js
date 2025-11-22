const Notification = require('../models/Notification');
const createError = require('http-errors');

exports.sentNotification = async (userId, topic, message) => {
    try {
        const notification = Notification.create({
            receiver: userId,
            topic,
            message
        })

        return notification;
    } catch (error) {
        throw createError(500, 'Failed to create notifications');
    }
    
}

exports.getNotifications = async (user) => {
    try{
        const notifications = await Notification.find({receiver: user.id}).sort({createAt: -1});
    
        await Notification.updateMany(
            { receiver: user.id, isRead: false },
            { $set: { isRead: true } }
        );

        return notifications
    }
    catch (error) {
        throw createError(500, 'Failed to fetch notifications');
    }
    
}