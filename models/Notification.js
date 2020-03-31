const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  by: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  to: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  type: { type: String, required: true },
  content: String,
  post: { type: mongoose.Types.ObjectId, ref: 'post', required: true },
  date: { type: Date, default: Date.now() },
  status: { type: Number, default: 0 }
});

module.exports = Notifications = mongoose.model(
  'notifications',
  notificationSchema
);
