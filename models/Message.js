const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  reciever: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  body: { type: String, required: true },
  date: { type: Number, default: Date.now() },
  status: { type: Number, default: 0 },
});

module.exports = Messages = mongoose.model('messages', MessageSchema);
