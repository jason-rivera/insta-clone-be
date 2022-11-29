const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  console.log('verifying the JWT with the middleware');
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.sendStatus(401); //unauthorized
  }
  // console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); //forbidden
    }
    // console.log(decoded, 'this is decoded');
    req.user = decoded.username;
    console.log(req.user, 'decoded user');
    next();
  });
};

module.exports = verifyJWT;
