const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'You need to be logged in to access this resource' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authMiddleware;
