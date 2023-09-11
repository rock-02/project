const express = require("express");
const {
  signUp,
  signIn,
  mailOtp,
  forgotPassword,
  resetPassoword,
  changePassword,
  complteProfile,
  getAllusers,
  getSingleUser,
  updateRole,
  deleteUser,
} = require("../controller/userController");
const { route } = require("../app");
const isLoggedIn = require("../middlewares/isloggedIn");

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/regester", mailOtp);

router.post("/forgotpassword", forgotPassword);

router.put("/reset/:token", resetPassoword);

router.route("/updatepassword").put(isLoggedIn, changePassword);

router.route("/compteprofile", isLoggedIn, complteProfile);

router
  .route("/admin/users")
  .get(isLoggedIn, isAuthorizedRoles("adimn"), getAllusers);

router
  .route("/admin/user/:id")
  .get(isLoggedIn, isAuthorizedRoles("adimn"), getSingleUser);

router
  .route("/admin/user/:id")
  .get(isLoggedIn, isAuthorizedRoles("adimn"), updateRole);

router
  .route("/admin/user/:id")
  .delete(isLoggedIn, isAuthorizedRoles("adimn"), deleteUser);

module.exports = router;
