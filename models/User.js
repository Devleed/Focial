const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  friends: [{ type: mongoose.Types.ObjectId, ref: 'user', required: true }],
  profile_picture: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetTokenExpiry: {
    type: Date
  }
});

module.exports = User = mongoose.model('user', userSchema);
