const dotenv = require('dotenv').config();
// const dotenv = require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const User = require('./models/user');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((result) => {
    console.log('Connected to DB');
    app.listen(PORT, () => {
      console.log(`Listening at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.get('/add-user', (req, res) => {
  const user = new User({
    username: 'new user 4',
    firstName: 'about my new user222',
    lastName: 'more about my new user222',
    email: 'my email222',
    password: 'super secret password222',
  });

  user
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
      console.log(err);
    });
});
