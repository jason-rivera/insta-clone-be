const dotenv = require('dotenv').config();
// const dotenv = require('dotenv').config({ path: './.env' });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const User = require('./models/user');
const Tweet = require('./models/tweet');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

//handles cors
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

//handles json body parsing for post requests
app.use(bodyParser.json());

// since we're passing json to our endpoints, we need to do this
app.use(express.json());

//let's you use the cookieParser in your application
app.use(cookieParser());

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

// const verifyJWT = async (req, res) => {
//   const response = await app.post('/auth/verify-jwt', async (req, res) => {
//     console.log(req.body, 'verify-jwt endpoint');

//     const token = req.body.accessToken;
//     if (token == null) {
//       return res.status(401).json({ message: 'currently no token' });
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
//       if (err) {
//         return res.status(403).json({ message: `${err}` });
//       }
//       console.log('verified');
//       return res.status(200).json(decodedUser);
//     });
//   });

//   return response;
// };

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    const newUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
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

app.get('/get-all-users', async (req, res) => {
  const users = await User.find({});
  console.log(users, 'get-allUsers endpoint');
  res.status(200).json(users);
});

app.get('/users/id/:id', async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
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
  const user = await User.find({ username: { $in: req.body.username } });

  if (user === null) {
    res.status(401).send();
  }

  try {
    const match = await bcryptjs.compare(req.body.password, user[0].password);
    if (match) {
      //JWT
      const payload = {
        id: user[0]._id.toString(),
        username: user[0].username,
      };
      const jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        noTimestamp: true,
        expiresIn: '30s',
      });

      res.cookie('jwt', jwtToken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json({
        accessToken: jwtToken,
        success: `User ${user[0].username} is logged in!`,
      });
    } else {
      res.status(401).json({
        message: 'incorrect password',
      });
    }
  } catch {
    res.status(500).send();
  }
});

//----------------------------------
app.use(verifyJWT);
//---------------------------------- anything below this will use verifyJWT middleware

app.post('/users/username/:username', async (req, res) => {
  const user = await User.find({ username: req.params.username });

  console.log(user);
  res.status(200).json(user);
});

app.post('/get-own-data', async (req, res) => {
  const user = await User.find({ username: req.user });
  res.status(200).json(user);
});

app.post('/tweet', async (req, res) => {
  console.log('got tweeted');
  try {
    const newTweet = await new Tweet({
      tweet: req.body.tweet,
      username: req.body.username,
    });
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

app.delete('/tweet/delete-all', async (req, res) => {
  try {
    const response = await Tweet.deleteMany({});
    console.log(response, 'response from tweet.deletemany');
    if (response.acknowledged) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

app.get('/tweets', async (req, res) => {
  try {
    console.log('tweets');
    const allTweets = await Tweet.find();
    res.status(200).json(allTweets);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

app.patch('/profile/update', async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
      }
    );

    const returnUser = await User.find({ _id: req.body.id });

    res.status(200).json(returnUser);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});
