const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const router = express.Router();

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
      let results = await User.find({ name: req.query.name }).select(
        '-password -register_date -passwordResetToken'
      );
      results = results.filter(user => user.id !== req.user.id);
      res.json({ searchResults: results });
    } catch (err) {
      return res.status(500).json({ msg: 'server error' });
    }
  }
);

// 5e29a72d73c5b26e0806e3b4
// 5e29a6bd73c5b26e0806e3b3
router.post(
  '/login',
  passport.authenticate('login', {
    session: false
  }),
  (req, res) => {
    if (req.user) {
      jwt.sign({ id: req.user.id }, config.get('jwtSecret'), (err, token) => {
        if (err) generateError(res, 500, 'server error, try again later');
        res.json({
          token: `Bearer ${token}`,
          user: {
            friends: req.user.friends,
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email
          }
        });
      });
    } else {
      return res.status(401).json({ msg: 'wrong password' });
    }
  }
);

router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  (req, res) => {
    jwt.sign({ id: req.user.id }, config.get('jwtSecret'), (err, token) => {
      if (err) generateError(res, 400, 'server error, try again later');
      res.json({
        token: `Bearer ${token}`,
        user: {
          friends: req.user.friends,
          _id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      });
    });
  }
);

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
    if (!user) generateError(res, 401, 'no user to update');

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

router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/api/user/loadUserFail'
  }),
  async (req, res) => {
    res.json({
      user: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        friends: req.user.friends
      }
    });
  }
);

router.get('/loadUserFail', (req, res) => {
  return res.status(401).json({ msg: 'failed to load user' });
});

router.get('/getEmails', async (req, res) => {
  try {
    let allUsers = await User.find({});
    allUsers = allUsers.map(user => user.email);
    res.json(allUsers);
  } catch (error) {
    generateError(res, 500, 'Server error');
  }
});

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select(
    'id name email friends register_date'
  );
  if (!user) generateError(res, 404, 'No user found');
  res.json(user);
});

router.post('/unfriend', async (req, res) => {
  try {
    const visitedUser = await User.findById(req.body.visitedUserID);
    const loggedUser = await User.findById(req.body.loggedUserID);

    console.log(visitedUser.friends);
    console.log(loggedUser.friends);

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
module.exports = router;
