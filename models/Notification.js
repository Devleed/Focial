const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  by: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  type: { type: String, required: true },
  content: String,
  post: String,
  date: { type: Date, default: Date.now() }
});

module.exports = Notifications = mongoose.model(
  'notifications',
  notificationSchema
);
