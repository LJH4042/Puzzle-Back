const express = require("express");
const router = express.Router();

const {
  getUser,
  registerUser,
  loginUser,
  addScore,
} = require("../controllers/userController");
const { authUser } = require("../middleware/authUser");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser).get(authUser, getUser);
router.route("/score").post(authUser, addScore);

module.exports = router;
