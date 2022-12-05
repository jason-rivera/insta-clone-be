const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// logs in a user
router.post('/login', async (req, res) => {
  const user = await User.find({ username: { $in: req.body.username } });
  const username = user[0].username;

  if (user === null) {
    res.status(401).send();
  }

  try {
    const match = await bcryptjs.compare(req.body.password, user[0].password);
    if (match) {
      //JWT
      const payload = {
        id: user[0]._id.toString(),
        // username: user[0].username,
      };
      const jwtToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        noTimestamp: true,
        expiresIn: '1280s',
      });

      res.status(200).json({
        accessToken: jwtToken,
        userToken: username,
        success: `User ${user.username} is logged in!`,
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

module.exports = router;
