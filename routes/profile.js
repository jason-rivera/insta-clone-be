const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.patch('/update', async (req, res) => {
  try {
    console.log(req.body);

    const filter = { username: req.body.usernameOld };
    const update = {
      username: req.body.usernameNew,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };

    let response = await User.findOneAndUpdate(filter, update);
    console.log(response, 'response from updating');

    const returnUser = await User.findOne(filter);
    console.log(returnUser);

    // res.status(200).json(returnUser);
    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;
