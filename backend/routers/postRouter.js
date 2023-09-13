const express = require('express');
const {
  getAllPosts,
  deletePost,
  updatePost,
  createPost,
  getPost,

  getOtherUserAllPosts
} = require('../controller/postController');

const router = express.Router();

router.route('/').get(getAllPosts).post(createPost);

router.route('/:id').put(updatePost).delete(deletePost).get(getPost);

router.route('/other/:id').get(getOtherUserAllPosts);

module.exports = router;
