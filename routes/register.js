const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

// registers a user
router.post('/new', async (req, res) => {
  try {
    const hashedPassword = await bcryptjs.hash(req.body.password, 10);
    const newUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      avatar: req.body.avatar,
      password: hashedPassword,
      isAdmin: false,
    });
    const savedUser = await newUser.save();
    console.log(req.body, 'registering data');
    res.status(200).json(savedUser);
    console.log(savedUser);
    console.log(`added ${savedUser.username} new user to the database`);
  } catch (err) {
    if (err.code === 11000) {
      console.log('Error 11000 (409) - Duplicate');
      res.status(409).json({ message: 'Record already exists' });
      return;
    }
    console.log(err);
    res.status(400).send(err);
  }
});
module.exports = router;
