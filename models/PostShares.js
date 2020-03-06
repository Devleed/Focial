const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  shared_by: { type: String, required: true },
  post: { type: String, required: true },
  content: { type: String, default: '' },
  likes: [],
  comments: [
    {
      author: String,
      content: String
    }
  ],
  date_shared: { type: Date, default: Date.now() }
});

module.exports = PostShares = mongoose.model('shares', shareSchema);
