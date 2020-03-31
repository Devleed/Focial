const User = require('../models/User');
const mongoose = require('mongoose');

const helpers = {
  getObjectId: str => mongoose.Types.ObjectId(str),
  findUser: async (obj, id, propName) => {
    const author = await User.findById(id)
      .select('name profile_picture')
      .lean();
    obj[propName] = author;
    return obj;
  },
  arrayConverter: async arr => {
    return arr.reduce((result, share) => {
      if (Array.isArray(share)) {
        if (share.length !== 0) for (let s in share) result.push(share[s]);
      } else result.push(share);
      return result;
    }, []);
  },
  commentsAuthorAtacher: async comments => {
    return await Promise.all(
      comments.map(async comment => {
        return await helpers.findUser(comment, comment.author, 'author');
      })
    );
  },
  friendsFinder: async friends => {
    const friendsData = await Promise.all(
      friends.map(async friend => {
        await User.findById(friend).select('name email profile_picture');
      })
    );
    return friendsData;
  }
};

module.exports = helpers;
