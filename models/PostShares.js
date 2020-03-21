const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  author: { type: String, required: true },
  post: { type: String, required: true },
  content: { type: String, default: '' },
  stats: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  date_shared: { type: Date, default: Date.now() }
});

module.exports = PostShares = mongoose.model('shares', shareSchema);
