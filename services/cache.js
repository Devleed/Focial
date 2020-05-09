// we will monkey patch mongoose library
const mongoose = require('mongoose');
// REDIS SETUP
// redis is basically used for caching purposes
// it stores data on our memory
const redis = require('redis');
const util = require('util');
const REDIS_URL = 'redis://127.0.0.1:6379';
const client = redis.createClient(REDIS_URL);
client.hget = util.promisify(client.hget);

// making copy of mongoose's exec function
const exec = mongoose.Query.prototype.exec;

// attaching a new cache function to each query
// if this is called it means query needs to be cached
mongoose.Query.prototype.cache = function (opts = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(opts.key || '');
  return this;
};

// overriding mongoose's exec function
mongoose.Query.prototype.exec = async function () {
  // if query does not need to be cached apply original exec function
  if (!this.useCache) return exec.apply(this, arguments);

  // create key
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  // find cached data
  const cacheData = await client.hget(this.hashKey, key);
  if (cacheData) {
    // convert plain js object into mongoose document
    const getMongoDoc = async obj => {
      // convert obj into doc
      let document = new this.model(obj);
      // see if doc needs population
      return await this.model.populate(
        document,
        Object.values(this._mongooseOptions.populate)
      );
    };
    console.log('SERVING FROM CACHE BUTCH');
    // if found
    // parse cache data
    const doc = JSON.parse(cacheData);
    // check if it's an array
    return Array.isArray(doc)
      ? await Promise.all(doc.map(async d => await getMongoDoc(d)))
      : // process further
        await getMongoDoc(doc);
    // return
  }

  // if not process
  const data = await exec.apply(this, arguments);
  // save cache data
  client.hset(this.hashKey, key, JSON.stringify(data));

  return data;
};

module.exports = {
  clearHash(key) {
    client.del(key);
  }
};
