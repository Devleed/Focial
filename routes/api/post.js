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

      // get posts shared by logged in user
      const sharesOfLoggedInUser = await PostShares.find({
        shared_by: req.user.id
      });
      let sharedPosts = await Promise.all(
        sharesOfLoggedInUser.map(async share => await makeSharePost(share))
      );

      // get posts shared by logged in user friends
      let friendsShares = await arrayConverter(
        await Promise.all(
          req.user.friends.map(
            async friend => await PostShares.find({ shared_by: friend })
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
          return post;
        })
      );

      console.log(allPosts);

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

        if (share.shared_by !== req.user.id)
          return res
            .status(401)
            .json({ msg: "You're not authenticate to delete the post" });

        const deletedShare = await PostShares.findByIdAndRemove(
          req.params.id,
          req.body
        );

        return res.json(deletedShare);
      }

      if (post.author !== req.user.id)
        return res
          .status(401)
          .json({ msg: "You're not authenticate to delete the post" });

      if (req.params.image_id !== 'none')
        await cloudinary.uploader.destroy(req.params.image_id);

      const deletedPost = await Post.findByIdAndRemove(req.params.id, req.body);

      const deletedPosts = await PostShares.deleteMany(
        {
          post: deletedPost.id
        },
        req.body
      );

      console.log(deletedPosts);

      return res.json(deletedPost);
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
      let post = await Post.findById(req.params.id);

      if (!post) {
        let share = await PostShares.findById(req.params.id);
        share.likes.push(req.user.id);

        let savedShare = await share.save();
        savedShare = savedShare.toObject();
        savedShare.comments = await commentsAuthorAtacher(savedShare.comments);
        const post = await makeSharePost(savedShare);

        return res.json(post);
      }
      post.likes.push(req.user.id);

      let savedPost = await post.save();
      savedPost = savedPost.toObject();
      savedPost = await findUser(savedPost, savedPost.author, 'author_name');
      savedPost.comments = await commentsAuthorAtacher(savedPost.comments);

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

      if (!post) {
        let share = await PostShares.findById(req.params.id);
        share.likes = share.likes.filter(p => p !== req.user.id);

        let savedShare = await share.save();
        savedShare = savedShare.toObject();

        savedShare.comments = await commentsAuthorAtacher(savedShare.comments);

        const post = await makeSharePost(savedShare);

        return res.json(post);
      }
      post.likes = post.likes.filter(p => p !== req.user.id);

      let savedPost = await post.save();
      savedPost = savedPost.toObject();
      savedPost = await findUser(savedPost, savedPost.author, 'author_name');
      savedPost.comments = await commentsAuthorAtacher(savedPost.comments);

      return res.json(savedPost);
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
      const comment = {
        author: req.user.id,
        content: req.body.comment
      };

      let post = await Post.findById(req.params.id);

      if (!post) {
        let share = await PostShares.findById(req.params.id);
        share.comments.push(comment);

        let savedShare = await share.save();
        savedShare = savedShare.toObject();
        savedShare.comments = await commentsAuthorAtacher(savedShare.comments);
        let sharePost = await makeSharePost(savedShare);

        return res.json(sharePost);
      }
      post.comments.push(comment);

      let savedPost = await post.save();
      savedPost = savedPost.toObject();
      savedPost = await findUser(savedPost, savedPost.author, 'author_name');
      savedPost.comments = await commentsAuthorAtacher(savedPost.comments);

      res.json(savedPost);
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
    let post = await Post.findById(req.params.id)
      .lean()
      .select('comments');

    if (!post) {
      let share = await PostShares.findById(req.params.id).lean();

      share.comments = await commentsAuthorAtacher(share.comments);

      let sharePost = await makeSharePost(share);
      return res.json(sharePost);
    }

    post.comments = await commentsAuthorAtacher(post.comments);

    res.json(post);
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
      // find the post
      const share = new PostShares({
        shared_by: req.user.id,
        post: req.params.id,
        content: req.body.postContent
      });

      const savedShare = await share.save();

      const post = await makeSharePost(savedShare);

      res.json(post);
    } catch (err) {
      return res.status(500).json({ msg: 'server error' });
    }
  }
);
const makeSharePost = async savedShare => {
  let post = await Post.findById(savedShare.post).lean();

  if (post) {
    post = await findUser(post, post.author, 'author_name');
    post = await findUser(post, savedShare.shared_by, 'share_author');
    post = {
      ...post,
      date_shared: savedShare.date_shared,
      share_body: savedShare.content,
      _id: savedShare._id,
      likes: savedShare.likes,
      comments: savedShare.comments,
      shared_by: savedShare.shared_by
    };
  }
  return post;
};

module.exports = router;
