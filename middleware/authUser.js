const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const User = require("../models/userModel");

const authUser = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      const decoded = jwt.verify(token, jwtSecret);
      req.user = await User.findById(decoded.id);
      next();
    } catch (err) {
      res.status(401).json({ message: "토큰이 없습니다." });
    }
  }
};

module.exports = { authUser };
