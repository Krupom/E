const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    receiver:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

    topic:{
        type: String,
        required:true
    },

    message:{
        type: String,
        required:true
    },
    
    isRead:{
      type: Boolean,
      default: false
    },
    
    createAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);