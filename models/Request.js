const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderID: {
    type: String,
    isRequired: true
  },
  recieverID: {
    type: String,
    isRequired: true
  },
  status: {
    type: Number,
    isRequired: true
  }
});

module.exports = Request = mongoose.model('request', requestSchema);
