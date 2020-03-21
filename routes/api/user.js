const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const { friendsFinder } = require('../../helpers/index');

const router = express.Router();

router.use(fileUpload({ useTempFiles: true }));

// importing models
const User = require('../../models/User');

router.use(express.json());

const generateError = (res, status, msg) => {
  return res.status(status).json({ msg, test: ' testing' });
};

router.get(
  '/search',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let regex = new RegExp(`${req.query.name}`, 'i');
      let results = await User.find({ name: { $regex: regex } }).select(
        'name profile_picture email friends register_date'
      );
      results = results.filter(user => user.id !== req.user.id);
      res.json({ searchResults: results });
    } catch (err) {
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

router.get('/fuzzy-search', async (req, res) => {
  try {
    let regex = new RegExp(`${req.query.term}`, 'i');
    let results = [];

    if (req.query.term) {
      results = await User.find({ name: { $regex: regex } }).select(
        'name profile_picture'
      );
      results.sort((a, b) => {
        if (
          a.name.toLowerCase().indexOf(req.query.term) !== -1 &&
          b.name.toLowerCase().indexOf(req.query.term) !== -1
        )
          return (
            a.name.toLowerCase().indexOf(req.query.term) -
            b.name.toLowerCase().indexOf(req.query.term)
          );
      });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) next(err);
    if (!user) generateError(res, 401, 'email or password is incorrect');
    jwt.sign({ id: user.id }, config.get('jwtSecret'), (err, token) => {
      if (err) generateError(res, 500, 'server error, try again later');
      res.json({
        token: `Bearer ${token}`,
        user
      });
    });
  })(req, res, next);
});

router.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) generateError(res, 401, 'Email Already Taken!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    const savedUser = await newUser.save();

    jwt.sign({ id: savedUser.id }, config.get('jwtSecret'), (err, token) => {
      if (err) generateError(res, 400, 'server error, try again later');
      res.json({
        token: `Bearer ${token}`,
        user: {
          friends: savedUser.friends,
          _id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email
        }
      });
    });
  } catch (error) {
    generateError(res, 500, 'server error, try again later');
  }
});

router.get('/reset', async (req, res) => {
  try {
    // get the token from query and find the user with that token
    const user = await User.findOne({
      passwordResetToken: req.query.token,
      passwordResetTokenExpiry: {
        $gt: Date.now()
      }
    });

    // if no user found then send error
    if (!user) return generateError(res, 401, 'Token is invalid or expired');

    // send response
    res.json({
      msg: 'Token is valid',
      email: user.email
    });
  } catch (error) {
    generateError(res, 500, 'an error occured try again later');
  }
});

router.put('/resetPasswordViaEmail', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) generateError(res, 401, 'No user found');

    // hash the given password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // set the password of that user and reset token to null
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;

    // save user
    await user.save();

    // send response
    res.json({ msg: 'password changed' });
  } catch (err) {
    generateError(res, 500, 'server error');
  }
});

router.post('/forget-password', async (req, res) => {
  try {
    // find the user
    const user = await User.findOne({ email: req.body.email });

    // if not found send error
    if (!user) generateError(res, 400, 'No user found');

    // create password resetting token
    const token = crypto.randomBytes(20).toString('hex');

    // update user's token and token's expiry date
    user.passwordResetToken = token;
    user.passwordResetTokenExpiry = Date.now() + 3600000;

    // save the user
    await user.save();

    // set up the transporter or the sender of the email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.get('senderEmail'),
        pass: config.get('senderPassword')
      }
    });

    // set up mail options
    const mailOptions = {
      from: config.get('senderEmail'),
      to: `${user.email}`,
      subject: 'Link to reset password',
      text: `You are recieving this because, you ( or someone else ) has requested to reset your password,click the following link to complete the process http://localhost:3000/reset/${token}`
    };

    // send the mail to the given candidate
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) throw err;
      else {
        res.json({
          msg:
            'recovery email sent, you can close this window and follow procedure from you gmail account',
          res: response
        });
      }
    });
  } catch (error) {
    console.error(error);
    generateError(res, 500, 'server error');
  }
});

router.get('/', (req, res, next) => {
  passport.authenticate(
    'jwt',
    {
      session: false
    },
    async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ msg: "your're not logged in" });
      user.friends = await friendsFinder(user.friends);
      return res.json(user);
    }
  )(req, res, next);
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'id name email friends register_date profile_picture'
  );
  if (!user) generateError(res, 404, 'No user found');
  res.json(user);
});

router.post('/unfriend', async (req, res) => {
  try {
    const visitedUser = await User.findById(req.body.visitedUserID);
    const loggedUser = await User.findById(req.body.loggedUserID);

    loggedUser.friends = loggedUser.friends.filter(
      friend => friend !== req.body.visitedUserID
    );
    visitedUser.friends = visitedUser.friends.filter(
      friend => friend !== req.body.loggedUserID
    );

    await loggedUser.save();
    await visitedUser.save();

    return res.json({ msg: 'success' });
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

router.put(
  '/update/profile/picture',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      console.log(req.files.photo);
      const { url } = await cloudinary.uploader.upload(
        req.files.photo.tempFilePath
      );
      const user = await User.findById(req.user.id);
      user.profile_picture = url;
      const savedUser = await user.save();
      res.json(savedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'internal server error' });
    }
  }
);
router.get('/get-friends/:id/:limit', async (req, res) => {
  try {
    // find user
    const user = await User.findById(req.params.id)
      .limit(req.params.limit)
      .select('friends')
      .lean();

    // if no user then send error
    if (!user) generateError(res, 401, 'No user found');

    // find friends information
    const friends = await Promise.all(
      user.friends.map(async friend => {
        return await User.findById(friend).select('name email profile_picture');
      })
    );
    user.friendsInfo = friends;

    // send response
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'internal server error' });
  }
});
module.exports = router;
