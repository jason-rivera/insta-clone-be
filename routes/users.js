const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/get-all-users', async (req, res) => {
  const users = await User.find({});
  console.log(users, 'get-allUsers endpoint');
  res.status(200).json(users);
});

module.exports = router;
