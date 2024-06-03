const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];

  // Check if token is in the blacklist
  client.get(token, (err, data) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    if (data === 'blacklisted') {
      return res.status(401).send('Token has been blacklisted');
    }

    // Verify the token
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      }

      // Attach user info to request
      req.user = decoded;
      next();
    });
  });
};

module.exports = verifyToken;