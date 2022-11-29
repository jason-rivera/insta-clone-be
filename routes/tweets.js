const express = require('express');
const router = express.Router();
const Tweet = require('../models/tweet');

router.post('/tweet', async (req, res) => {
  console.log('got tweeted');
  try {
    const newTweet = await new Tweet({
      tweet: req.body.tweet,
      username: req.body.username,
    });
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.delete('/delete-all', async (req, res) => {
  try {
    const response = await Tweet.deleteMany({});
    console.log(response, 'response from tweet.deletemany');
    if (response.acknowledged) {
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

router.get('/tweets', async (req, res) => {
  try {
    console.log('tweets');
    const allTweets = await Tweet.find();
    res.status(200).json(allTweets);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

module.exports = router;
