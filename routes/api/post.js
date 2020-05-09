const express = require('express');
const passport = require('passport');
const { getObjectId } = require('../../helpers');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

const router = express.Router();

const Post = require('../../models/Post');
const PostShares = require('../../models/PostShares');
const PostComments = require('../../models/PostComments');
const PostLikes = require('../../models/PostLikes');
const Notification = require('../../models/Notification');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const getUrls = require('get-urls');

router.use(fileUpload({ useTempFiles: true }));
router.use(express.json());

const scrapeMetaTags = text => {
  const urls = Array.from(getUrls(text));

  if (urls.length === 0) return {};

  const requests = urls.map(async url => {
    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    const getMetaTag = name =>
      $(`meta[name=${name}]`).attr('content') ||
      $(`meta[property="og:${name}"]`).attr('content') ||
      $(`meta[property="twitter:${name}"]`).attr('content');

    return {
      url,
      title: $('title').first().text(),
      description: getMetaTag('description'),
      image: getMetaTag('image'),
      author: getMetaTag('author'),
      favicon: $('link[rel="shortcut icon"]').attr('content')
    };
  });

  return Promise.all(requests);
};

/**
 * Create Post
 * Private
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // try to scrape meta tags
      const data = await scrapeMetaTags(req.body.postBody);

      // create the post
      const newPost = new Post({
        author: getObjectId(req.user._id),
        body: req.body.postBody || '',
        scrapedData: data
      });

      // upload and add image if any
      if (req.files) {
        const result = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath
        );
        newPost.post_image = {
          url: result.url,
          public_id: result.public_id,
          width: result.width,
          height: result.height
        };
      }

      // save the post
      let post = await newPost.save();

      // populate the post by author
      await Post.populate(post, {
        path: 'author',
        select: 'name profile_picture friends'
      });

      post = post.toObject();
      post.likes = (
        await PostLikes.find({ post: post._id }).select('author').lean()
      ).map(({ author }) => author);

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * get single post
 */
router.get('/:id', async (req, res) => {
  try {
    // try to find the post
    let post = await Post.findById(req.params.id)
      .populate('author', 'name profile_picture friends')
      .lean();

    // if no post try to find share
    if (!post) {
      // if found populate it with post and post's author
      post = await PostShares.findById(req.params.id)
        .populate([
          {
            path: 'author',
            select: 'name email profile_picture'
          },
          {
            path: 'post',
            select: 'post_image body author date_created',
            populate: { path: 'author', select: 'name email profile_picture' }
          }
        ])
        .lean();
    }

    if (!post) res.status(404).json({ msg: 'no post found' });

    post.likes = (
      await PostLikes.find({ post: post._id }).select('author').lean()
    ).map(({ author }) => author);

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'server error' });
  }
});
/**
 * Get All Post
 * Private
 */
router.get(
  '/getposts/:limit/:skip',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let skip, limit;
      skip = Number(req.params.skip);
      limit = Number(req.params.limit);

      let allPosts = await Post.find({
        $or: [
          { author: getObjectId(req.user._id) },
          { author: { $in: req.user.friends } }
        ]
      })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name friends profile_picture')
        .lean();

      let allShares = await PostShares.find({
        $or: [
          { author: getObjectId(req.user._id) },
          { author: { $in: req.user.friends } }
        ]
      })
        .skip(skip)
        .limit(limit)
        .populate([
          { path: 'author', select: 'name profile_picture email' },
          {
            path: 'post',
            select: 'post_image author body date_created',
            populate: { path: 'author', select: 'name profile_picture email' }
          }
        ])
        .lean();
      allPosts = allPosts.concat(allShares);
      allPosts = await Promise.all(
        allPosts.map(async post => {
          post.likes = (
            await PostLikes.find({ post: post._id }).select('author').lean()
          ).map(({ author }) => author);
          return post;
        })
      );

      res.json(allPosts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * Delete Post
 * Private
 */
router.delete(
  '/:id/:image_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post;
      // try to find and delete post
      post = await Post.findOneAndDelete({
        $and: [
          { _id: getObjectId(req.params.id) },
          { author: getObjectId(req.user._id) }
        ]
      }).lean();
      // if no post found
      if (!post) {
        // try to find it in share and delete it
        post = await PostShares.findOneAndDelete({
          $and: [
            { _id: getObjectId(req.params.id) },
            { author: getObjectId(req.user._id) }
          ]
        }).lean();
      } else {
        // else delete the image
        if (req.params.image_id !== 'none')
          await cloudinary.uploader.destroy(req.params.image_id);
      }
      // if still no post then user is not authenticated
      if (!post)
        res
          .status(401)
          .json({ msg: 'youre not authenticate enough to delete this post' });
      // delete likes and comments of that post
      await Promise.all([
        PostComments.deleteMany({ post: post._id }),
        PostLikes.deleteMany({ post: post._id })
      ]);

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * Edit Post
 * Private
 */
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: { body: req.body.postBody }
        },
        { new: true }
      ).lean();
      if (!post) {
        post = await PostShares.findByIdAndUpdate(
          req.params.id,
          {
            $set: { body: req.body.postBody }
          },
          { new: true }
        ).lean();
      }
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * Like post
 * private
 */
router.patch(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // create new like
      let like = {
        author: getObjectId(req.user._id),
        post: getObjectId(req.params.id)
      };
      let newLike = new PostLikes(like);
      // save like
      await newLike.save();
      // update post's stats
      let post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { 'stats.likes': 1 }
        },
        { new: true }
      )
        .select('stats')
        .lean();
      // if not found
      if (!post) {
        // update share stats
        post = await PostShares.findByIdAndUpdate(
          req.params.id,
          {
            $inc: { 'stats.likes': 1 }
          },
          { new: true }
        )
          .select('stats')
          .lean();
      }

      // if not found send res
      if (!post) res.json({ msg: 'no post found' });

      res.json({
        _id: post._id,
        likes: (
          await PostLikes.find({ post: post._id }).select('author').lean()
        ).map(({ author }) => author),
        stats: post.stats
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * unlike post
 * private
 */
router.patch(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // find like and delete it
      await PostLikes.findOneAndDelete({
        author: getObjectId(req.user._id),
        post: getObjectId(req.params.id)
      });

      // update post stats
      let post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { 'stats.likes': -1 }
        },
        { new: true }
      ).lean();
      // if not found
      if (!post) {
        // update share stats
        post = await PostShares.findByIdAndUpdate(
          req.params.id,
          {
            $inc: { 'stats.likes': -1 }
          },
          { new: true }
        ).lean();
      }
      // delete notification
      await Notification.findOneAndDelete({
        post: req.params.id,
        by: req.user._id,
        to: post.author,
        type: 'like'
      });

      res.json({
        _id: post._id,
        likes: (
          await PostLikes.find({ post: post._id }).select('author').lean()
        ).map(({ author }) => author),
        stats: post.stats
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * post a comment
 * private
 */
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // create comment
      const postComment = {
        author: getObjectId(req.user._id),
        post: req.params.id,
        content: req.body.comment
      };
      const comment = new PostComments(postComment);

      // update post stats
      let post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { 'stats.comments': 1 }
        },
        { new: true }
      ).lean();
      // if not found
      if (!post)
        // update share stats
        post = await PostShares.findByIdAndUpdate(
          req.params.id,
          {
            $inc: { 'stats.comments': 1 }
          },
          { new: true }
        ).lean();

      // save comment
      let savedComment = await comment.save();

      // populate it by author
      await PostComments.populate(savedComment, {
        path: 'author',
        select: 'name profile_picture friends'
      });

      res.json({
        comment: savedComment,
        id: savedComment.post,
        stats: post.stats
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * get all comments
 * public
 */
router.get('/comment/:id', async (req, res) => {
  try {
    let comments = await PostComments.find({ post: getObjectId(req.params.id) })
      .populate('author', 'name profile_picture friends')
      .lean();

    res.json({ comments, id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'server error' });
  }
});

/**
 * share post
 * private
 */
router.patch(
  '/share/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // find post and then increment its shares
      let post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { 'stats.shares': 1 }
        },
        { new: true }
      ).lean();

      // if no post found
      if (!post) {
        // update stats of share
        let share = await PostShares.findByIdAndUpdate(
          req.params.id,
          {
            $inc: { 'stats.shares': 1 }
          },
          { new: true }
        ).lean();

        // and then find the post by share
        post = await Post.findById(share.post).lean();
      }

      const share = new PostShares({
        author: getObjectId(req.user._id),
        body: req.body.postContent,
        post: getObjectId(post._id)
      });

      let savedShare = await share.save();

      await PostShares.populate(savedShare, [
        {
          path: 'author',
          select: 'name email profile_picture'
        },
        {
          path: 'post',
          select: 'post_image body author date_created',
          populate: { path: 'author', select: 'name email profile_picture' }
        }
      ]);

      savedShare = savedShare.toObject();
      savedShare.likes = (
        await PostLikes.find({ post: savedShare._id }).select('author').lean()
      ).map(({ author }) => author);

      res.json(savedShare);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

module.exports = router;
