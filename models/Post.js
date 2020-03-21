const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  post_image: {
    url: String,
    public_id: String,
    width: Number,
    height: Number
  },
  date_created: {
    type: Date,
    default: Date.now()
  },
  stats: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
});

module.exports = Post = mongoose.model('post', postSchema);
