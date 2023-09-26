const { default: mongoose } = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    reply: {
      message: {
        type: String,
      },
      Time: {
        type: Date,
      },
    },
    commentTo: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
    },
    commentBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },

  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
