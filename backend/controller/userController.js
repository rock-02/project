const catchAsyncError = require('../middlewares/catchAsynError');
const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/nodeMailer');
const sendToken = require('../utils/sendToken');
const crypto = require('crypto');
const uniqueOtp = require('../utils/uniqueOtp');

// !  sending otp to email

exports.mailOtp = async (req, res, next) => {
  const { email } = req.body;

  const otp = await uniqueOtp(email);

  const optns = {
    email: email,
    subject: 'Otp for verification purpose',
    message: `otp Sent Succesfully ${otp}`,
  };

  try {
    await sendEmail(optns);
    res.status(200).json({
      success: true,
      message: `Mail sent to ${email} SuccessFully`,
    });
  } catch (err) {
    console.log(err);
    return next(
      new ErrorHandler(404, 'Otp verification failed Try after some time')
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
    return next(new ErrorHandler(400, 'Invalid Otp'));
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'this is sample id',
      public_url: 'Profile Url',
    },
  });

  sendToken(user, res, 200);
});

// ! singin

exports.signIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(404, 'All fields are compusory'));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(new ErrorHandler(404, 'EMail is Not regestered with us'));
  }

  if (!user.comparePassword(password)) {
    return next(new ErrorHandler(404, 'Invalid Email or Password'));
  }

  sendToken(user, res, 200);
});

//  ! logout

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return res.status(200).json({
    success: true,
    msg: 'logged Out successfully',
  });
});

// ! forgotPassword

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler(400, 'Email not regestered'));
  }
  const resetToken = user.getResetPasswordToken();

  user.save({ validateBeforeSave: false });

  // console.log(resetToken);

  const resetLink = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const options = {
    email: req.body.email,
    subject: 'Forgott Password related ',
    message: `Reset Your Passoword by clicking the below Link ${resetLink}`,
  };

  try {
    await sendEmail(options);

    res.status(200).json({
      suceess: true,
      msg: 'Link Sent To Email Sucessfully',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    return next(new ErrorHandler(404, err.message));
  }
};

// ! resetPssword

exports.resetPassoword = catchAsyncError(async (req, res, next) => {
  const resetToken = await crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log(req.params.token, resetToken);
  console.log(Date.now());
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log(user);
  if (!user) {
    return next(new ErrorHandler(404, 'InvalidToken Or token has expired'));
  }

  if (req.body.password !== req.body.confirmpassword) {
    return next(
      new ErrorHandler(404, 'password doesnt match with confirmpassword')
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  user.save();

  return res.status(200).json({
    sucess: true,
    msg: 'Password reset Successfully',
  });
});

// ! Compltete Profile or addition detals
exports.complteProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    { _id: req.user.user_id },
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );

  if (!user) {
    return next(new ErrorHandler(404, 'Update failed try after some times'));
  }

  res.status(200).json({
    sucess: true,
    msg: 'updated Successfully',
    user,
  });
});

// !  changePassword

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmpassword } = req.body;

  const user = await User.findById({ _id: req.user.user_id }).select(
    '+password'
  );

  if (!(await user.comparePassword(oldPassword))) {
    return next(new ErrorHandler(404, 'Incorrect Password'));
  }

  if (newPassword !== confirmpassword) {
    return next(
      new ErrorHandler(404, 'password doesnt match with confimpassword')
    );
  }

  user.password = newPassword;

  user.save();

  res.status(200).json({
    sucess: true,
    msg: 'Password updated sucessfully',
  });
});

//  ! getAll users

exports.getAllusers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    suceess: true,
    users,
  });
});

// !update userRole - Admin
exports.updateRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });

  if (!user) {
    return next(new ErrorHandler(404, 'User Not exist'));
  }

  user.role = req.body.role;

  user.save();

  res.status(200).json({
    sucess: true,
    msg: 'Role updated by successfuylyy',
  });
});

// !getSIngle User -Admin

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });

  if (!user) {
    return next(ErrorHandler(404, 'user Not regestered'));
  }

  res.status(200).json({
    sucess: true,
    msg: user,
  });
});

//!DeleteUSer -Admin

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete({ _id: req.params.id });

  if (!user) {
    return next(ErrorHandler(404, 'user Not regestered'));
  }

  res.status(200).json({
    sucess: true,
    msg: 'User deleted Successfully',
    user,
  });
});
