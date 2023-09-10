const express = require('express');
const {
  getAllPosts,
  deletePost,
  updatePost,
  createPost,
} = require('../controller/postController');

const router = express.Router();

router.route('/').get(getAllPosts).post(createPost);

router.route('/:id').put(updatePost).delete(deletePost);

module.exports = router;
