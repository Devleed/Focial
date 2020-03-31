const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  reciever: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: { type: Number, default: 0 }
});

module.exports = Request = mongoose.model('request', requestSchema);
