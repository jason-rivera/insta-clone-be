const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.patch('/update', async (req, res) => {
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

module.exports = router;
