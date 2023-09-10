const User = require('../models/userModel');
const sendToken = require('../utils/sendToken');

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !password || !name) {
    res.status(400).send('Please provide valid credentials');
  }
  const user = await User.create(req.body);
  sendToken(user, res, 200);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    res.status(500).json({
      sucess: false,
      msg: 'Email Not registered',
    });
  }

  if (!user.comparePassword(password)) {
    res.status(400).json({
      sucess: false,
      msg: 'Invalid Email or Password',
    });
  }

  sendToken(user, res, 200);
};
