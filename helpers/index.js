const User = require('../models/User');

module.exports = {
  findUser: async (obj, id, propName) => {
    const author = await User.findById(id)
      .select('name -_id')
      .lean();
    obj[propName] = author.name;
    return obj;
  }
};
