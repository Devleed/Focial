const express = require('express');
const passport = require('passport');
const router = express.Router();

const Post = require('../../models/Post');

router.use(express.json());

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
        author_name: req.user.name,
        body: req.body.postBody
      });
      const savedPost = await newPost.save();
      return res.json(savedPost);
    } catch (err) {
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
      const posts = req.user.friends.map(
        async friend => await Post.find({ author: friend })
      );
      const ownPosts = await Post.find({ author: req.user.id });
      let allPosts = await Promise.all(posts);
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
      res.json(allPosts);
    } catch (err) {
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

      await Post.findByIdAndRemove(req.params.id, req.body);
      return res.json({ msg: 'success' });
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
      let post = await Post.findById(req.params.id);
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
      const savedPost = await post.save();
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
      const savedPost = await post.save();
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
      const post = await Post.findById(req.params.id);
      post.comments.push({
        author: req.user.id,
        author_name: req.user.name,
        content: req.body.comment
      });
      const savedPost = await post.save();
      return res.json(savedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);
module.exports = router;
