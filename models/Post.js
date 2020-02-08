const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  author_name: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
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
      author_name: String,
      content: String
    }
  ]
});

module.exports = Post = mongoose.model('post', postSchema);
