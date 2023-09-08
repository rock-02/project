const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

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
};
const User = mongoose.model("User", userSchema);
module.exports = User;
