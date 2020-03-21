const express = require('express');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('config');
const cloudinary = require('cloudinary').v2;

const app = express();

cloudinary.config({
  cloud_name: 'drhgwsxz0',
  api_key: '269154181167999',
  api_secret: 'kwgcJBhvxkcoDT53asrlm0w1VqE'
});

// setting routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/request', require('./routes/api/request'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/notification', require('./routes/api/notification'));

// setting middlewares
app.use(express.json());
app.use(passport.initialize());

require('./passport_config/passport')(passport);

// setting up database
const db = config.get('mongoURI');

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('database connected'))
  .catch(e => console.log(`error => ${e}`));

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/test', async (req, res) => {
  const file = req.files.photo;
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    res.json(result.url);
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => console.log(`listening on port ${port}`));
