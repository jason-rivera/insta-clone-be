const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/username/:username', async (req, res) => {
  const user = await User.find({ username: req.params.username });
  console.log(user);
  res.status(200).json(user);
});

router.post('/get-own-data', async (req, res) => {
  console.log('got to get own data endpoint');
  const user = await User.find({ username: req.user });
  res.status(200).json(user);
});

router.delete('/delete-all-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'deleted all users' });
    console.log('deleted all users in database');
  } catch (e) {
    res.status(400).json({ message: 'unable to delete users in db' });
    console.error(e);
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

router.get('/get-all-users', async (req, res) => {
  console.log('get all users endpoint hit');
  const users = await User.find({});
  console.log(users, 'get-allUsers endpoint');
  res.status(200).json(users);
});

module.exports = router;
