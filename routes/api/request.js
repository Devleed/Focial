const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

// importing models
const User = require('../../models/User');
const Request = require('../../models/Request');

router.use(express.json());

router.post('/', async (req, res) => {
  try {
    // find the reciever
    const user = await User.findById(req.body.visitedUserID).select(
      'name email profile_picture'
    );

    // find the sender
    const loggedUser = await User.findById(req.body.loggedUserID).select(
      'name email profile_picture'
    );

    // create request
    const request = new Request({
      sender: loggedUser.id,
      reciever: user.id,
      status: 2
    });
    const savedRequest = (await request.save()).toObject();

    // send response
    res.json(savedRequest);
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

      // const query = [
      //   { $match: { reciever: mongoose.Types.ObjectId(req.user._id) } },
      //   {
      //     $lookup: {
      //       from: 'user',
      //       localField: 'sender',
      //       foreignField: '_id',
      //       as: 'senderDetails'
      //     }
      //   },
      //   { $unwind: '$authorDetails' }
      // ];
      // let recieved = await Request.aggregate(query);
      // console.log(recieved);
      // res.json(recieved);

      // find the requests sent or recieved
      let requests = await Request.find({
        $or: [
          { reciever: mongoose.Types.ObjectId(req.user._id) },
          { sender: mongoose.Types.ObjectId(req.user._id) }
        ]
      })
        .populate('sender reciever', 'name profile_picture friends email', {
          email: { $ne: req.user.email }
        })
        .lean();

      res.json({
        recieved: requests.filter(({ reciever }) => !reciever),
        sent: requests.filter(({ sender }) => !sender)
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'server error, try again later' });
    }
  }
);

router.patch('/accepted/:id', async (req, res) => {
  try {
    // find and delete the request
    const request = await Request.findByIdAndRemove(req.params.id, req.body);

    // await User.update({
    //   $or: [{ id: request.sender }, { id: request.reciever }]
    // }, { $push: { friends}});

    // modify user's friend list
    await User.findByIdAndUpdate(request.sender, {
      $push: { friends: mongoose.Types.ObjectId(request.reciever) }
    });
    await User.findByIdAndUpdate(request.reciever, {
      $push: { friends: mongoose.Types.ObjectId(request.sender) }
    });

    // send response back
    res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});

router.delete('/rejected/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndRemove(req.params.id, req.body);
    res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});
router.delete('/cancel/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndRemove(req.params.id, req.body);
    return res.json(request);
  } catch (err) {
    return res.status(500).json({ msg: 'server error, try again later' });
  }
});
router.get(
  '/seen',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Request.updateMany(
        { reciever: mongoose.Types.ObjectId(req.user._id), status: 0 },
        { $set: { status: 1 } }
      );
      res.json({ msg: 'success' });
    } catch (err) {
      console.error(err);
    }
  }
);
module.exports = router;
