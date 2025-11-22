const mongoose = require('mongoose');

const WaitlistSchema = new mongoose.Schema(
  {
    reserveDate: {
      type: String, //YYYY-MM-DD
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    spaceId: {
      type: mongoose.Schema.ObjectId,
      ref: 'CoworkingSpace',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model('Waitlist', WaitlistSchema);


