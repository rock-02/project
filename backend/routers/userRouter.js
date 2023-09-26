const express = require('express');
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
  logout,
} = require('../controller/userController');
const { route } = require('../app');
const isLoggedIn = require('../middlewares/isloggedIn');

const router = express.Router();

router.post('/signup', signUp);

router.post('/signin', signIn);

router.get('/signout', logout);
router.post('/regester', mailOtp);

router.post('/forgotpassword', forgotPassword);

router.put('/reset/:token', resetPassoword);

router.route('/updatepassword').put(isLoggedIn, changePassword);

router.route('/compteprofile', isLoggedIn, complteProfile);

router.route('/admin/users').get(isLoggedIn, getAllusers);

router.route('/admin/user/:id').get(isLoggedIn, getSingleUser);

router.route('/admin/user/:id').get(isLoggedIn, updateRole);

router.route('/admin/user/:id').delete(isLoggedIn, deleteUser);

module.exports = router;
