const Post = require('../models/postModel');

const createPost = async (req, res) => {
  req.body.createdBy = req.user.user_id;
  const post = await Post.create(req.body);
  res.status(201).json({ post });
};

const deletePost = async (req, res) => {
  const {
    user: { user_id },
    params: { id: postId },
  } = req;

  const post = await Post.findByIdAndRemove({
    _id: postId,
    createdBy: user_id,
  });
  if (!post) {
    return res.status(400).send('No post with such postId');
  }
  res.status(200).json({ post });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find({ createdBy: req.user.user_id }).sort(
    'createdAt'
  );
  res.status(200).json({ count: posts.length, posts });
};

const updatePost = async (req, res) => {
  const {
    user: { user_id },
    params: { id: postId },
  } = req;

  const post = await Post.findByIdAndUpdate(
    { _id: postId, createdBy: user_id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!post) {
    return res.status(400).send('No post with such postId');
  }

  res.json({ post });
};

module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  deletePost,
};
