const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');
const passport = require('passport');

const app = express();

// setting routes
app.use('/api/user', require('./routes/api/user'));

// setting middlewares
app.use(express.json());
app.use(passport.initialize());

require('./passport_config/passport')(passport);

// setting up mongodb
const db = config.get('mongoURI');

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('db connect'))
  .catch(e => console.log(`db error => ${e}`));

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('hells');
});

app.listen(port, () => console.log(`listening on port ${port}`));
