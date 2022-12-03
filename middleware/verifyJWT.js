const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('verification: 401 unauthorized (no token)');
    return res.sendStatus(401); //unauthorized
  }
  // console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('verification: 403 forbidden (no privilege/expired token)');
      return res.sendStatus(403); //forbidden
    }
    // console.log(decoded, 'this is decoded');
    req.id = decoded.id;
    console.log(req.id, 'decoded user ID');
    console.log('verification: granted');
    next();
  });
};

module.exports = verifyJWT;
