const express = require('express');
const passport = require('passport');
const { getObjectId } = require('../../helpers/index');
const router = express.Router();

router.use(express.json());

const Message = require('../../models/Message');
const User = require('../../models/User');

const getConditionQuery = id => ({ $eq: ['$sender', getObjectId(id)] });

console.log(require('../../server'));
// check for messages
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const messages = await Message.aggregate([
        {
          $match: {
            $or: [
              { reciever: getObjectId(req.user._id) },
              { sender: getObjectId(req.user._id) }
            ]
          }
        },
        {
          $group: {
            _id: {
              $cond: {
                if: getConditionQuery(req.user._id),
                then: '$reciever',
                else: '$sender'
              }
            },
            message: {
              $last: {
                sentBy: {
                  $cond: {
                    if: getConditionQuery(req.user._id),
                    then: req.user._id,
                    else: '$sender'
                  }
                },
                body: '$body',
                date: '$date',
                status: '$status'
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            'user.name': 1,
            'user.profile_picture': 1,
            'user._id': 1,
            'user.register_date': 1,
            message: 1,
            _id: 0
          }
        }
      ]);

      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'internal server error ' });
    }
  }
);

// create message
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const newMessage = new Message({
        sender: getObjectId(req.user._id),
        reciever: getObjectId(req.params.id),
        body: req.body.messageBody,
        date: Date.now()
      });

      const savedMessage = await newMessage.save();

      res.json({
        sentBy: true,
        body: savedMessage.body,
        date: savedMessage.date
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'internal server error ' });
    }
  }
);

// get chat between two users
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const messages = await Message.aggregate([
        {
          $match: {
            $and: [
              {
                $or: [
                  { sender: getObjectId(req.params.id) },
                  { sender: getObjectId(req.user._id) }
                ]
              },
              {
                $or: [
                  { reciever: getObjectId(req.params.id) },
                  { reciever: getObjectId(req.user._id) }
                ]
              }
            ]
          }
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: {
                  format: '%m-%d-%Y',
                  date: { $toDate: '$date' }
                }
              },
              user: {
                $cond: {
                  if: getConditionQuery(req.user._id),
                  then: '$reciever',
                  else: '$sender'
                }
              }
            },
            messages: {
              $push: {
                sentBy: {
                  $cond: {
                    if: getConditionQuery(req.user._id),
                    then: req.user._id,
                    else: '$sender'
                  }
                },
                body: '$body',
                date: '$date'
              }
            }
          }
        },
        { $sort: { '_id.date': -1 } },
        {
          $group: {
            _id: '$_id.user',
            messagesByDate: {
              $push: { date: '$_id.date', messages: '$messages' }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            'user.name': 1,
            'user.friends': 1,
            'user.profile_picture': 1,
            'user.register_date': 1,
            'user.email': 1,
            'user._id': 1,
            _id: 0,
            messagesByDate: 1
          }
        }
      ]);

      if (messages.length === 0) {
        messages.push({
          messagesByDate: [],
          user: await User.findById(req.params.id).select(
            'name email profile_picture register_date friends'
          )
        });
      }

      res.json(messages[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'internal server error ' });
    }
  }
);

// delete message

// test
router.get(
  '/test/work/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const messages = await Message.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { sender: getObjectId(req.params.id) },
                { sender: getObjectId(req.user._id) }
              ]
            },
            {
              $or: [
                { reciever: getObjectId(req.params.id) },
                { reciever: getObjectId(req.user._id) }
              ]
            }
          ]
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$date' } }
            },
            user: {
              $cond: {
                if: getConditionQuery(req.user._id),
                then: '$reciever',
                else: '$sender'
              }
            }
          },
          messages: {
            $push: {
              sentBy: {
                $cond: {
                  if: getConditionQuery(req.user._id),
                  then: '$reciever',
                  else: '$sender'
                }
              },
              body: '$body'
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id.user',
          messages: { $push: { date: '$_id.date', messages: '$messages' } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.name': 1,
          'user.friends': 1,
          'user.profile_picture': 1,
          'user.register_date': 1,
          'user.email': 1,
          'user._id': 1,
          _id: 0,
          messages: 1
        }
      }
    ]);
    res.json(messages[0]);
  }
);

module.exports = router;
