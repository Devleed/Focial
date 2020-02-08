const express = require('express');
const passport = require('passport');

const router = express.Router();

// importing models
const User = require('../../models/User');
const Request = require('../../models/Request');

router.use(express.json());

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.body.visitedUserID);
    const loggedUser = await User.findById(req.body.loggedUserID);
    const request = new Request({
      senderID: loggedUser.id,
      recieverID: user.id,
      status: 2
    });
    await request.save();
    return res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ msg: 'Unauthorized' });
      const requestRecieved = await Request.find({ recieverID: req.user.id });
      const requestSent = await Request.find({ senderID: req.user.id });

      res.json({ requestRecieved, requestSent });
    } catch (err) {
      return res.status(500).json({ msg: 'server error, try again later' });
    }
  }
);

router.post('/accepted', async (req, res) => {
  try {
    const user = await User.findById(req.body.visitedUserID);
    const loggedUser = await User.findById(req.body.loggedUserID);
    user.friends.push(loggedUser.id);
    loggedUser.friends.push(user.id);
    await user.save();
    await loggedUser.save();
    await Request.deleteOne({
      senderID: req.body.visitedUserID,
      recieverID: req.body.loggedUserID
    });
    res.json({ msg: 'success' });
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

router.post('/rejected', async (req, res) => {
  try {
    await Request.deleteOne({
      senderID: req.body.visitedUserID,
      recieverID: req.body.loggedUserID
    });
    res.json({ msg: 'success' });
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});
router.post('/cancel', async (req, res) => {
  try {
    await Request.deleteOne({
      recieverID: req.body.visitedUserID,
      senderID: req.body.loggedUserID
    });
    return res.json({ msg: 'success' });
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

module.exports = router;
