const catchAsyncError = require("../middlewares/catchAsyncError");
const Otp = require("../models/otpModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/nodeMailer");
const sendToken = require("../utils/sendToken");
const uniqueOtp = require("../utils/uniqueOtp");

// !  sending otp to email

exports.mailOtp = async (req, res, next) => {
  const { email } = req.body;

  const otp = await uniqueOtp(email);

  const optns = {
    email: email,
    subject: "Otp for verification purpose",
    message: `otp Sent Succesfully ${otp}`,
  };

  try {
    await sendEmail(optns);
    res.status(200).json({
      success: true,
      message: `Mail sent to ${user.email} SuccessFully`,
    });
  } catch (err) {
    return next(
      new ErrorHandler(404, "Otp verification failed Try after some time")
    );
  }
};

// ! signUp

exports.signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password, otp } = req.body;

  const exceptedOtp = await Otp.find({ email: email })
    .sort({ createdAt: -1 })
    .limit(1);
  console.log(otp, exceptedOtp[0].otp);

  if (otp != exceptedOtp[0].otp) {
    return next(new ErrorHandler(400, "Invalid Otp"));
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      public_url: "Profile Url",
    },
  });

  sendToken(user, res, 200);
});

// ! singin

exports.signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(404, "All fields are compusory"));
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler(404, "EMail is Not regestered with us"));
  }

  if (!user.comparePassword(password)) {
    return next(new ErrorHandler(404, "Invalid Email or Password"));
  }

  sendToken(user, res, 200);
});

//  ! logout

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    msg: "logged Out successfully",
  });
});

// ! forgotPassword

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler(400, "Email not regestered"));
  }
  const resetToken = user.getResetPasswordToken();

  // console.log(resetToken);

  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const options = {
    email: req.body.email,
    subject: "Forgott Password related ",
    message: `Reset Your Passoword by clicking the below Link ${resetLink}`,
  };

  try {
    await sendEmail(options);

    res.status(200).json({
      suceess: true,
      msg: "Link Sent To Email Sucessfully",
    });
  } catch (err) {
    return next(new ErrorHandler(404, err.message));
  }
};

//  ! resetPassword
