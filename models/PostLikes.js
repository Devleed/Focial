const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
  author: { type: String, required: true },
  post: { type: String, required: true },
  date_liked: { type: Date, default: Date.now() }
});

module.exports = PostLikes = mongoose.model('likes', likesSchema);
