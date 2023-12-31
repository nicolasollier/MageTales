const jwt = require("jsonwebtoken");

const authController = {
  verifyToken: (req, res, next) => {
    const token = req.cookies["auth-token"];

    if (!token) {
      return res.status(401).send("Access Denied: No token provided");
    }

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  },
};

module.exports = authController;
