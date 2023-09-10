const { default: mongoose } = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    post: {
      public_id: {
        type: String,
      },
      public_url: {
        type: String,
      },
    },
    type: {
      type: String,
      default: 'Public',
      enum: ['Public', 'Private'],
    },
    caption: {
      type: String,
    },
    Comments: [
      {
        comment: { type: String },
        commentBy: { type: mongoose.Types.ObjectId, ref: 'User' },
      },
    ],
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
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please Provide user'],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
