const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Email required"],
    minLength: 8,
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
    },
    public_url: {
      type: String,
    },
  },
  posts: [
    {
      name: {
        type: String,
      },
    },
  ],
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],

  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: String,
  },
});
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods = {
  // ! json web Token

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

  // !reset Password Token

  getResetPasswordToken() {
    const resetToken = crypto.randomBytes(10).toString("hex");

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
  },

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  },
};
const User = mongoose.model("User", userSchema);
module.exports = User;
