const User = require('../models/User');

const helpers = {
  findUser: async (obj, id, propName) => {
    const author = await User.findById(id)
      .select('name -_id')
      .lean();
    obj[propName] = author.name;
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
        return await helpers.findUser(comment, comment.author, 'author_name');
      })
    );
  }
};

module.exports = helpers;
