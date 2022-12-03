const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/verify-current-user', async (req, res) => {
  console.log('verify-cuirrent-user endpoint');
  console.log(req.user);
  const user = await User.find({ username: req.user });
  res.status(200).json(user);
});

module.exports = router;
