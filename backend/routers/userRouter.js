const express = require('express');
const { registerUser, login } = require('../controller/userController');

const {
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  approveRequest,
} = require('../controller/follow');

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', login);

router.post('/follow/:id', follow);

router.post('/unfollow/:id', unfollow);

router.get('/followers', getFollowers);

router.get('/following', getFollowing);

router.get('/userInfo/:id', getUser);

router.post('/approve/:id', approveRequest);

module.exports = router;
