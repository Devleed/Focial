const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

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
      let post = await Post.findById(req.params.postId)
        .select('author')
        .lean();
      if (!post)
        post = await PostShares.findById(req.params.postId)
          .select('author')
          .lean();

      const newNotification = new Notification({
        by: mongoose.Types.ObjectId(req.user._id),
        to: mongoose.Types.ObjectId(post.author),
        post: mongoose.Types.ObjectId(req.params.postId),
        type: req.body.type,
        content: req.body.content
      });
      let savedNotification = (await newNotification.save()).toObject();

      let notification = await Notification.findById(savedNotification.id)
        .populate('by to post')
        .lean();

      res.json(notification);
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
      let notifications = await Notification.find({ to: req.user._id }).lean();
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
      res.status(500).json({ msg: 'server error' });
    }
  }
);

router.patch('/opened/:id', async (req, res) => {
  try {
    let notification = await Notification.findByIdAndUpdate(req.params.id, {
      $set: { status: 1 }
    });
    res.json({ notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'server error' });
  }
});

router.get(
  '/seen',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let notifications = await Notification.updateMany(
        { to: req.user.id, status: 0 },
        { $set: { status: 2 } }
      );
      console.log(notifications);
      res.json({ notifications });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'server error' });
    }
  }
);
module.exports = router;
