const express = require("express");
const {
  signUp,
  signIn,
  mailOtp,
  updatePassword,
  forgotPassword,
} = require("../controller/userController");
const { route } = require("../app");
const isLoggedIn = require("../middlewares/isloggedIn");

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/regester", mailOtp);

router.post("/isloggin", isLoggedIn);

// router.post("/update", isLoggedIn, updatePassword);

router.post("/forgotpassword", forgotPassword);

module.exports = router;
