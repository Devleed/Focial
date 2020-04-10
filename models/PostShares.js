const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  post: { type: mongoose.Types.ObjectId, ref: 'post', required: true },
  body: { type: String, default: '' },
  stats: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  date_shared: { type: Number, default: Date.now() }
});

module.exports = PostShares = mongoose.model('post_shares', shareSchema);
