const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const ErorHandeler = require('../utils/errorHandler');

const giveComment = async (req, res, next) => {
  const { id: postId } = req.params;
  req.body.commentBy = req.user.user_id;
  req.body.commentTo = postId;
  const comment = await Comment.create(req.body);

  const post = await Post.findByIdAndUpdate(
    { _id: postId },
    {
      $push: { Comments: comment._id },
    },
    { new: true, runValidators: true }
  );

  if (!post) {
    return res.send('invalid postid');
  }

  res.json({ post });
};

const giveReply = async (req, res, next) => {
  const comment = await Comment.findById({ _id: req.params.id });
  if (!comment) {
    return next(new ErorHandeler(400, 'No comment with such id'));
  }
  const postId = comment.commentTo;
  const post = await Post.findById({ _id: postId });
  const postUserId = post.createdBy.toString();
  console.log(postUserId, req.user.user_id);
  if (postUserId != req.user.user_id) {
    return next(new ErorHandeler(401, 'not authorized to reply'));
  }
  comment.reply.message = req.body.reply;
  comment.reply.Time = Date.now();
  comment.save();
  return res.json(comment);
};

module.exports = {
  giveComment,
  giveReply,
};
