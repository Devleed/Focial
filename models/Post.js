const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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
    type: Number,
    default: Date.now()
  },
  stats: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  scrapedData: Object
});

module.exports = Post = mongoose.model('post', postSchema);
