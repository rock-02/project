const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: Date.now() + 5 * 60,
  },
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
