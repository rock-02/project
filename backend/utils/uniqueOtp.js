const otpGenerator = require('otp-generator');
const Otp = require('../models/otpModel');

const generateOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return otp;
};

const uniqueOtp = async (email) => {
  const generatedOtp = generateOtp();
  const otpExists = await Otp.findOne({ otp: generatedOtp });

  if (otpExists) {
    return uniqueOtp(email);
  }

  await Otp.create({ email: email, otp: generatedOtp });
  return generatedOtp;
};

module.exports = uniqueOtp;
