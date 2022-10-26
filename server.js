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
const jwt = require('jsonwebtoken');

//handles cors
app.use(cors());

//handles json body parsing for post requests
app.use(bodyParser.json());

// since we're passing json to our endpoints, we need to do this
app.use(express.json());

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

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   console.log(authHeader);

//   // Bearer TOKEN (taking this TOKEN)
//   const token = authHeader && authHeader.split(' ')[1];
//   console.log(token);

// };

app.post('/auth/verify-jwt', async (req, res) => {
  console.log(req.body, 'verify-jwt endpoint');

  const token = req.body.accessToken;
  if (token == null) {
    console.log('ending authenticateToken');
    return res.status(401).send();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send();
    }
    console.log('got hereeeee');
    res.status(200).json(user);
  });
});

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

app.get('/get-own-data', async (req, res) => {
  console.log('get own data endpoint hit');
  // console.log(req.body); // GET methods don't have a body

  const users = await User.find({ username: '123' }); //TODO: need to make this dynamic
  console.log(users, 'get-own-data endpoint');
});

app.get('/get-all-users', async (req, res) => {
  const users = await User.find({});
  console.log(users, 'get-allusers endpoint');
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

  const userToFind = await User.find({ username: { $in: username } });

  if (userToFind === null) {
    res.status(401).send();
  }
  console.log(userToFind[0].email);

  try {
    if (await bcryptjs.compare(password, userToFind[0].password)) {
      //JWT
      const user = { name: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res
        .status(200)
        .json({ accessToken: accessToken, message: 'login success!' });
    } else {
      res.status(401).send();
    }
  } catch {
    res.status(500).send();
  }
});
