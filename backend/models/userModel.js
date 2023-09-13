const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const JWT = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Email required'],
    minLength: 8,
    select: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  additionalDetails: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    mobileNUmber: {
      type: String,
    },
  },
  avatar: {
    public_id: {
      type: String,
    },
    public_url: {
      type: String,
    },
  },
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
  followRequest: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],

  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods = {
  getJwtToken() {
    return JWT.sign(
      {
        user_id: this._id,
        name: this.name,
        email: this.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
  },

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  },

  getResetPasswordToken() {
    const resetToken = crypto.randomBytes(10).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  },
};
const User = mongoose.model('User', userSchema);
module.exports = User;
