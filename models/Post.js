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
  likes: {
    type: Array,
    default: []
  },
  comments: [
    {
      author: String,
      content: String
    }
  ]
});

module.exports = Post = mongoose.model('post', postSchema);
