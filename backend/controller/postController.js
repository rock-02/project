const Post = require('../models/postModel');
const User = require('../models/userModel');
const cloudinary = require('cloudinary').v2;
var fs = require('fs');
const ErorHandeler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsynError');

const createPost = catchAsyncError(async (req, res, next) => {
  req.body.createdBy = req.user.user_id;
  console.log(req.body);

  const file = req.files.post;
  console.log(file.tempFilePath);
  await cloudinary.uploader.upload(file.tempFilePath, (err, res) => {
    if (err) {
      return next(new ErorHandeler(400, 'unable to upload to cloudinary'));
    }
    console.log(res);
    req.body.post = { public_id: res.public_id, public_url: res.url };
    console.log(req.body);
  });
  const post = await Post.create(req.body);

  fs.unlink(file.tempFilePath, function (err) {
    if (err) {
      return next(new ErorHandeler(400, 'Unable to delete file'));
    }
    console.log('File deleted!');
  });

  res.status(201).json(post);
});

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

  cloudinary.uploader
    .destroy(post.post.public_id)
    .then((result) => console.log(result));

  res.status(200).json(post);
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

const giveLike = async (req, res, next) => {
  const { id: postId } = req.params;
  const { user_id: currentId } = req.user;

  const postTemp = await Post.findById({ _id: postId });
  if (!postTemp) {
    return res.send('invalid postid');
  }

  const postUser_id = post.createdBy;
  const postUser = await User.findById({ _id: postUser_id });

  if (postUser.followers.includes(currentId) || postUser.type === 'Public') {
    const post = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        $push: { likes: req.user.user_id },
      },
      { new: true, runValidators: true }
    );
    return res.json({ likes: post.likes, hits: post.likes.length });
  } else {
    return next(new ErorHandeler(401, 'Unauthorize access'));
  }
};

const givedisLike = async (req, res, next) => {
  const { id: postId } = req.params;
  const { user_id: currentId } = req.user;

  const postTemp = await Post.findById({ _id: postId });
  if (!postTemp) {
    return res.send('invalid postid');
  }

  const postUser_id = post.createdBy;
  const postUser = await User.findById({ _id: postUser_id });

  if (postUser.followers.includes(currentId) || postUser.type === 'Public') {
    const post = await Post.findByIdAndUpdate(
      { _id: postId },
      {
        $push: { dislikes: req.user.user_id },
      },
      { new: true, runValidators: true }
    );
    return res.json({ dislikes: post.dislikes, hits: post.dislikes.length });
  } else {
    return next(new ErorHandeler(401, 'Unauthorize access'));
  }
};

const getPost = async () => {
  const { id: postId } = req.params;
  const { user_id: currentId } = req.user;

  const post = await Post.findById({ _id: postId });
  if (!post) {
    return next(new ErorHandeler(400, `No post with id ${postId}`));
  }

  const { postUser_id } = post.createdBy;

  if (postUser_id == currentId) {
    return res.json(post);
  }

  if (post.type === 'Public') {
    post.views += 1;
    return res.json(post);
  } else {
    const postUser = await User.findById({ _id: postUser_id });
    if (postUser.followers.includes(currentId)) {
      post.views += 1;
      return res.json(post);
    } else {
      return next(new ErorHandeler(401, 'Unauthorize access- not a follower'));
    }
  }
};

const getOtherUserAllPosts = async () => {
  const { id: postUser_id } = req.params;

  const postUser = await User.findById({ _id: postUser_id });
  if (!postUser) {
    return next(new ErorHandeler(400, 'Bad request- no user with such id'));
  }
  if (!postUser.followers.includes(req.user.user_id)) {
    const post = await Post.find({ createdBy: postUser_id, type: 'Public' });
    if (!post) {
      return res.send('No posts foe you to view');
    }
    return res.json(post);
  }

  const post = await Post.find({ createdBy: postUser_id });
  if (!post) {
    return res.send('No posts foe you to view');
  }
  return res.json(post);
};

module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  deletePost,
  giveLike,
  givedisLike,
  getPost,
  getOtherUserAllPosts,
};
