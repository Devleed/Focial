const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  post: { type: mongoose.Types.ObjectId, ref: 'post', required: true },
  content: { type: String, default: '' },
  likes: [],
  date_commented: { type: Date, default: Date.now() }
});

commentSchema.index({ post: 1 });

module.exports = PostComments = mongoose.model('post_comments', commentSchema);
