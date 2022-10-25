const dotenv = require('dotenv').config();
// const dotenv = require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');

//handles cors
app.use(cors());

//handles json body parsing for post requests
app.use(bodyParser.json());

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

app.post('/add-user', async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    const newUser = await new User({
      username: req.body.firstName,
      firstName: req.body.lastName,
      lastName: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
    console.log(savedUser);
    console.log(`added ${savedUser.username} new user to the database`);
  } catch (err) {
    console.log(err);
  }
});

app.get('/get-users', async (req, res) => {
  const users = await User.find({});
  console.log(users, 'displaying users from the server-database');
});

app.delete('/delete-all-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'deleted all users' });
    console.log('deleted all users in database');
  } catch (e) {
    res.status(400).json({ message: 'unable to delete users in db' });
    console.error(e);
  }
});

app.post('/users/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.find({ username: { $in: username } });

  if (user === null) {
    res.status(401).send();
  }
  console.log(user[0].email);

  try {
    if (await bcryptjs.compare(password, user[0].password)) {
      res.status(200).send('success login!');
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(500).send();
  }
});
