const express = require('express');
const passport = require('passport');
const { findUser } = require('../../helpers');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

const router = express.Router();

const Post = require('../../models/Post');

router.use(fileUpload({ useTempFiles: true }));
router.use(express.json());

// updates the post user
const updatePostComment = async savedPost => {
  let post = await Post.findById(savedPost._id).lean();
  post = await findUser(post, post.author, 'author_name');
  post.comments = post.comments.map(async comment => {
    return await findUser(comment, comment.author, 'author_name');
  });
  post.comments = await Promise.all(post.comments);
  return post;
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
      const newPost = new Post({
        author: req.user.id,
        body: req.body.postBody
      });
      if (req.files) {
        const result = await cloudinary.uploader.upload(
          req.files.photo.tempFilePath
        );
        newPost.post_image.width = result.width;
        newPost.post_image.height = result.height;
        newPost.post_image.url = result.url;
      }
      const savedPost = await newPost.save();
      let post = await Post.findById(savedPost._id).lean();
      post = await findUser(post, post.author, 'author_name');
      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * Get All Post
 * Private
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // get the posts of friends
      const posts = req.user.friends.map(
        async friend =>
          await Post.find({ author: friend })
            .lean()
            .select('-comments')
      );

      // get the post of logged in user
      const ownPosts = await Post.find({ author: req.user.id })
        .lean()
        .select('-comments');
      let allPosts = await Promise.all(posts);

      // concatenate both posts
      allPosts = allPosts
        .reduce((result, post) => {
          if (Array.isArray(post)) {
            if (post.length !== 0) {
              for (let p in post) result.push(post[p]);
            }
          } else result.push(post);
          return result;
        }, [])
        .concat(ownPosts);

      // find the authors of the post
      allPosts = allPosts.map(async post => {
        return await findUser(post, post.author, 'author_name');
      });
      allPosts = await Promise.all(allPosts);

      // send response
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
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.author !== req.user.id)
        return res
          .status(401)
          .json({ msg: "You're not authenticate to delete the post" });
      const deletedPost = await Post.findByIdAndRemove(req.params.id, req.body);
      return res.json(deletedPost);
    } catch (err) {
      return res.status(500).json({ msg: 'server error' });
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
      let post = await Post.findById(req.params.id).select('body author');
      if (post.author !== req.user.id)
        return res
          .status(401)
          .json({ msg: "you're not authenticate to edit this post" });
      post.body = req.body.postBody;
      const savedPost = await post.save();
      return res.json(savedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * Like post
 * private
 */
router.get(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);
      post.likes.push(req.user.id);
      let savedPost = await post.save();
      savedPost = await updatePostComment(savedPost);
      return res.json(savedPost);
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
router.get(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);
      post.likes = post.likes.filter(p => p !== req.user.id);
      let savedPost = await post.save();
      savedPost = await updatePostComment(savedPost);
      return res.json(savedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.id);
      post.comments.push({
        author: req.user.id,
        author_name: req.user.name,
        content: req.body.comment
      });
      let savedPost = await post.save();
      savedPost = await updatePostComment(savedPost);
      return res.json(savedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

router.get('/comment/:id', async (req, res) => {
  try {
    let post = await Post.findById(req.params.id)
      .lean()
      .select('comments');
    post.comments = post.comments.map(async comment => {
      return await findUser(comment, comment.author, 'author_name');
    });
    post.comments = await Promise.all(post.comments);
    return res.json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
