const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  post: { type: String, required: true },
  content: { type: String, default: '' },
  likes: [],
  date_commented: { type: Date, default: Date.now() }
});

module.exports = PostComments = mongoose.model('comments', commentSchema);
