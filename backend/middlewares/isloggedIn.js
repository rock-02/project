const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    // return next(new ErrorHandler("Please Login", 401));
    return res.json({
      success: 'Login failed due to missing token',
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return res.json({
        success: 'Login failed due to unauthorized token',
      });
    }

    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

module.exports = isLoggedIn;
