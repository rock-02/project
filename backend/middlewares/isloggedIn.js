const JWT = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
  let cookie = req.headers.cookie;
  console.log(cookie);
  const token = cookie.replace('token=', '');
  console.log(token);
  if (!token) {
    res.status(400).json({
      sucess: false,
      msg: 'Invalid Token Please log in',
    });
  }

  const user = await JWT.verify(token, process.env.JWT_SECRET);

  req.user = user;

  next();
};

module.exports = isLoggedIn;
