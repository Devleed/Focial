// importing required modules
const express = require('express');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('config');
const cloudinary = require('cloudinary').v2;
const socketio = require('socket.io');
const cors = require('cors');
const { getObjectId } = require('./helpers/index');

const Message = require('./models/Message');

// setting up express
const app = express();

// setting up server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`listening on port ${port}`));

// setting up socket.io
const io = socketio(server);

// setting up cloudinary
cloudinary.config({
  cloud_name: 'drhgwsxz0',
  api_key: '269154181167999',
  api_secret: 'kwgcJBhvxkcoDT53asrlm0w1VqE',
});

// setting up cors
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    return callback(null, true);
  },
};
app.use(cors(corsOptions));

// setting routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/request', require('./routes/api/request'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/notification', require('./routes/api/notification'));
app.use('/api/message', require('./routes/api/message'));

// setting middlewares
app.use(express.json());
app.use(passport.initialize());

require('./passport_config/passport')(passport);

// setting up database
const db = config.get('mongoURI');

// setting up mongoose
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('database connected'))
  .catch((e) => console.log(`error => ${e}`));

// socket.io management
// all online users
let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('connected => ', socket.id);
  try {
    // user's online
    socket.on('user_connected', (user) => {
      socket.user = user;
      onlineUsers[user._id] = socket;
      socket.broadcast.emit('online_users', Object.keys(onlineUsers));
      socket.emit('online_users', Object.keys(onlineUsers));
    });

    // user sending private message to somenone
    socket.on('private_message', async ({ reciever, body }, cb) => {
      // create and save message in database
      const newMessage = new Message({
        sender: getObjectId(socket.user._id),
        reciever: getObjectId(reciever),
        body: body,
        date: Date.now(),
      });
      const savedMessage = await newMessage.save();

      const message = {
        body: savedMessage.body,
        date: savedMessage.date,
        sentBy: savedMessage.sender,
      };
      // check if reciever is online
      if (onlineUsers.hasOwnProperty(reciever)) {
        // if yes, send message to reciever
        onlineUsers[reciever].emit('private_message', message);
      }

      // alert sender that message has been sent
      cb(message);
    });

    // user's offline
    socket.on('disconnect', (user) => {
      delete onlineUsers[user._id];
      socket.broadcast.emit('online_users', Object.keys(onlineUsers));
      socket.emit('online_users', Object.keys(onlineUsers));
    });
  } catch (err) {
    console.error(err);
  }
});

// checking if production is in build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// test route
app.get('/test', async (req, res) => {
  const file = req.files.photo;
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    res.json(result.url);
  } catch (err) {
    console.error(err);
  }
});
