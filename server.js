const dotenv = require('dotenv').config();
// const dotenv = require('dotenv').config({ path: './.env' });
const express = require('express');
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const User = require('./models/user');
const Tweet = require('./models/tweet');
const cors = require('cors');
const bodyParser = require('body-parser');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const API_V1 = '/api/v1';

// handles cors
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

// handles json body parsing for post requests
app.use(bodyParser.json());

// since we're passing json to our endpoints, we need to do this
app.use(express.json());

// let's you use the cookieParser in your application
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

// These routes won't use verifyJWT middleware
app.use(API_V1 + '/register', require('./routes/register'));
app.use(API_V1 + '/auth', require('./routes/auth'));

//-----------------------
app.use(verifyJWT); // anything below this will use verifyJWT middleware
//-----------------------

app.use(API_V1 + '/users', require('./routes/users'));
app.use(API_V1 + '/tweets', require('./routes/tweets'));
app.use(API_V1 + '/profile', require('./routes/profile'));
app.use(API_V1 + '/verify', require('./routes/verify'));
