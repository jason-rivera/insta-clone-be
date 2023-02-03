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
  jwt.verify(
    token,
    'e16863a1e28e73d0d7a647035cbcc91c344b0a2aeef49c135a6cbecedee03b0772fdfbe3589896903cd88d32bc16cdee5bf4595e66e26614d6a56adaaf210bf',
    (err, decoded) => {
      if (err) {
        console.log('verification: 403 forbidden (no privilege/expired token)');
        return res.sendStatus(403); //forbidden
      }
      // console.log(decoded, 'this is decoded');
      req.id = decoded.id;
      console.log(req.id, 'decoded user ID');
      console.log('verification: granted');
      next();
    }
  );
};

module.exports = verifyJWT;
