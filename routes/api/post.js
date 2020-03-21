const express = require('express');
const passport = require('passport');
const {
  findUser,
  arrayConverter,
  commentsAuthorAtacher
} = require('../../helpers');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

const router = express.Router();

const User = require('../../models/User');
const Post = require('../../models/Post');
const PostShares = require('../../models/PostShares');
const PostComments = require('../../models/PostComments');
const PostLikes = require('../../models/PostLikes');
const Notification = require('../../models/Notification');

router.use(fileUpload({ useTempFiles: true }));
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
        body: req.body.postBody
      });
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
      const savedPost = await newPost.save();
      let post = savedPost.toObject();
      post.author = await User.findById(post.author).select(
        'name profile_picture friends'
      );
      post.likes = (await PostLikes.find({ post: post._id })).map(
        like => like.author
      );

      return res.json(post);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

/**
 * get single post
 */
router.get('/:id', async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean();
    if (!post) {
      let share = await PostShares.findById(req.params.id).lean();
      share.likes = (await PostLikes.find({ post: share._id })).map(
        like => like.author
      );
      share = await makeSharePost(share);
      return res.json(share);
    }
    post.author = await User.findById(post.author).select(
      'name friends profile_picture'
    );
    post.likes = (await PostLikes.find({ post: post._id })).map(
      like => like.author
    );
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
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // get the posts of friends
      const posts = req.user.friends.map(
        async friend => await Post.find({ author: friend }).lean()
      );

      // get the post of logged in user
      const ownPosts = await Post.find({ author: req.user.id }).lean();
      let allPosts = await Promise.all(posts);

      // get posts shared by logged in user
      const sharesOfLoggedInUser = await PostShares.find({
        author: req.user.id
      });
      let sharedPosts = await Promise.all(
        sharesOfLoggedInUser.map(async share => await makeSharePost(share))
      );

      // get posts shared by logged in user friends
      let friendsShares = await arrayConverter(
        await Promise.all(
          req.user.friends.map(
            async friend => await PostShares.find({ author: friend })
          )
        )
      );

      let friendSharedPosts = await Promise.all(
        friendsShares.map(async share => await makeSharePost(share))
      );

      // concatenate all posts
      allPosts = await arrayConverter(allPosts);
      allPosts = allPosts
        .concat(ownPosts)
        .concat(friendSharedPosts)
        .concat(sharedPosts)
        .reduce((result, post) => {
          if (post) result.push(post);
          return result;
        }, []);

      // find the authors of the post
      allPosts = await Promise.all(
        allPosts.map(async post => {
          const author = await User.findById(post.author).select(
            'name profile_picture friends'
          );
          post.author = author;
          post.likes = (await PostLikes.find({ post: post._id })).map(
            like => like.author
          );
          return post;
        })
      );

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
  '/:id/:image_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        let share = await PostShares.findById(req.params.id);

        if (share.author !== req.user.id)
          return res
            .status(401)
            .json({ msg: "You're not authenticate to delete the post" });

        const deletedShare = await PostShares.findByIdAndRemove(
          req.params.id,
          req.body
        );

        await PostComments.deleteMany({ post: deletedShare.id });
        await PostLikes.deleteMany({ post: deletedShare.id });

        return res.json(deletedShare);
      }

      if (post.author !== req.user.id)
        return res
          .status(401)
          .json({ msg: "You're not authenticate to delete the post" });

      if (req.params.image_id !== 'none')
        await cloudinary.uploader.destroy(req.params.image_id);

      const deletedPost = await Post.findByIdAndRemove(req.params.id, req.body);

      await PostComments.deleteMany({ post: deletedPost.id });
      await PostLikes.deleteMany({ post: deletedPost.id });

      res.json(deletedPost);
    } catch (err) {
      console.error(err);
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
      let like = {
        author: req.user.id,
        post: req.params.id
      };
      let newLike = new PostLikes(like);

      let post = await Post.findById(req.params.id);
      if (!post) {
        post = await PostShares.findById(req.params.id);
      }
      if (!post) res.json({ msg: 'no post found' });
      post.stats.likes = ++post.stats.likes;

      let savedPost = await post.save();
      let savedLike = (await newLike.save()).toObject();

      res.json({
        _id: savedPost.id,
        likes: (await PostLikes.find({ post: savedPost.id })).map(
          like => like.author
        ),
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
router.get(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await PostLikes.findOneAndDelete({
        author: req.user.id,
        post: req.params.id
      });

      let post = await Post.findById(req.params.id);
      if (!post) {
        post = await PostShares.findById(req.params.id);
      }
      await Notification.findOneAndDelete({
        post: req.params.id,
        by: req.user.id,
        to: post.author,
        type: 'like'
      });

      post.stats.likes = --post.stats.likes;

      let savedPost = await post.save();

      res.json({
        _id: savedPost.id,
        likes: (await PostLikes.find({ post: savedPost.id })).map(
          like => like.author
        ),
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
      const postComment = {
        author: req.user.id,
        post: req.params.id,
        content: req.body.comment
      };

      const comment = new PostComments(postComment);

      let post = await Post.findById(req.params.id);
      if (!post) post = await PostShares.findById(req.params.id);

      post.stats.comments = ++post.stats.comments;

      await post.save();

      let savedComment = await comment.save();
      savedComment = savedComment.toObject();

      savedComment.author = await User.findById(savedComment.author).select(
        'name email profile_picture'
      );

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
    let comments = await PostComments.find({ post: req.params.id }).lean();
    comments = await Promise.all(
      comments.map(async comment => {
        comment.author = await User.findById(comment.author).select(
          'name email profile_picture'
        );
        return comment;
      })
    );
    res.json({ comments, id: req.params.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'server error' });
  }
});

/**
 * share post
 * private
 */
router.put(
  '/share/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const share = new PostShares({
        author: req.user.id,
        post: req.params.id,
        content: req.body.postContent
      });

      let post = await Post.findById(req.params.id);
      if (!post) post = await PostShares.findById(req.params.id);

      post.stats.shares = ++post.stats.shares;

      await post.save();

      let savedShare = (await share.save()).toObject();
      savedShare.likes = (await PostLikes.find({ post: savedShare._id })).map(
        ({ author }) => author
      );

      const sharedPost = await makeSharePost(savedShare);

      res.json(sharedPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error' });
    }
  }
);
const makeSharePost = async savedShare => {
  let savedPost = await Post.findById(savedShare.post).lean();

  if (savedPost) {
    savedPost = await findUser(savedPost, savedShare.author, 'share_author');
    savedPost = {
      ...savedPost,
      author: await User.findById(savedPost.author).select(
        'name profile_picture friends'
      ),
      date_shared: savedShare.date_shared,
      share_body: savedShare.content,
      _id: savedShare._id,
      likes: savedShare.likes,
      stats: savedShare.stats
    };
  }
  return savedPost;
};

module.exports = router;
