const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use(express.json());

const Post = require('../../models/Post');
const Notification = require('../../models/Notification');
const User = require('../../models/User');
const PostShares = require('../../models/PostShares');

/**
 * create notification
 * private
 */
router.post(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.postId);
      if (!post) post = await PostShares.findById(req.params.postId);

      console.log(post);

      const newNotification = new Notification({
        by: req.user.id,
        to: post.author,
        post: req.params.postId,
        type: req.body.type,
        content: req.body.content
      });
      let savedNotification = (await newNotification.save()).toObject();

      savedNotification.by = await User.findById(savedNotification.by).select(
        'name profile_picture'
      );
      savedNotification.to = await User.findById(savedNotification.to).select(
        'name profile_picture'
      );
      savedNotification.post = post;
      res.json(savedNotification);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * get notification
 * private
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let notifications = await Notification.find({ to: req.user.id }).lean();
      notifications = await Promise.all(
        notifications.map(async notification => {
          notification.by = await User.findById(notification.by).select(
            'name profile_picture'
          );
          return notification;
        })
      );
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500), json({ msg: 'server error' });
    }
  }
);
module.exports = router;
