const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  post: { type: mongoose.Types.ObjectId, ref: 'post', required: true },
  date_liked: { type: Date, default: Date.now() }
});

likesSchema.index({ post: 1 });

module.exports = PostLikes = mongoose.model('post_likes', likesSchema);
