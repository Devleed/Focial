const express = require('express');
const passport = require('passport');
const { findUser } = require('../../helpers');

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
      let requestRecieved = await Request.find({
        recieverID: req.user.id
      }).lean();
      let requestSent = await Request.find({ senderID: req.user.id });

      let requestRecievedAuthors = requestRecieved.map(async request => {
        return await findUser(request, request.senderID, 'sender_name');
      });
      requestRecieved = await Promise.all(requestRecievedAuthors);

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
    const request = await Request.findOne({
      senderID: req.body.visitedUserID,
      recieverID: req.body.loggedUserID
    });
    await Request.deleteOne({
      senderID: req.body.visitedUserID,
      recieverID: req.body.loggedUserID
    });
    res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

router.post('/rejected', async (req, res) => {
  try {
    const request = await Request.findOne({
      senderID: req.body.visitedUserID,
      recieverID: req.body.loggedUserID
    });
    await Request.deleteOne({
      senderID: req.body.visitedUserID,
      recieverID: req.body.loggedUserID
    });
    res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});
router.post('/cancel', async (req, res) => {
  try {
    const request = await Request.findOne({
      recieverID: req.body.visitedUserID,
      senderID: req.body.loggedUserID
    });
    await Request.deleteOne({
      recieverID: req.body.visitedUserID,
      senderID: req.body.loggedUserID
    });
    return res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

module.exports = router;
