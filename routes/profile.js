const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

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

router.patch('/password/update', async (req, res) => {
  const user = await User.find({ username: { $in: req.body.username } });

  if (user.length === 0) {
    res.status(401).send();
    return;
  }

  const hashedNewPassword = await bcryptjs.hash(req.body.newPassword, 10);

  try {
    const match = await bcryptjs.compare(
      req.body.currentPassword,
      user[0].password
    );
    if (match) {
      const filter = { username: req.body.username };
      const update = {
        password: hashedNewPassword,
      };

      let response = await User.findOneAndUpdate(filter, update);

      res.status(200).send(response);
    } else {
      res.status(401).send({ message: 'Incorrect Password' });
    }

    res.status(200).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;
