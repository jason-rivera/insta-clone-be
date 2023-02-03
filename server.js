const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8080;

// handles json body parsing for post requests
app.use(bodyParser.json());

// since we're passing json to our endpoints, we need to do this
app.use(express.json());

// let's you use the cookieParser in your application
app.use(cookieParser());

app.get('/ping', async (req, res) => {
  res.status(200).send({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT);
});
