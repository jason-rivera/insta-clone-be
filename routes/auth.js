const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// logs in a user
router.post('/login', async (req, res) => {
  const user = await User.find({ username: { $in: req.body.username } });

  if (user.length === 0) {
    res.status(401).send();
    return;
  }

  const username = user[0].username;

  try {
    const match = await bcryptjs.compare(req.body.password, user[0].password);
    if (match) {
      //JWT
      const payload = {
        id: user[0]._id.toString(),
        // username: user[0].username,
      };
      const jwtToken = jwt.sign(
        payload,
        'e16863a1e28e73d0d7a647035cbcc91c344b0a2aeef49c135a6cbecedee03b0772fdfbe3589896903cd88d32bc16cdee5bf4595e66e26614d6a56adaaf210bf',
        {
          noTimestamp: true,
          expiresIn: '1280s',
        }
      );

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
