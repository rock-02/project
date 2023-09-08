const JWT = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  const token = req.cookie.token;

  if (!token) {
    res.status(400).json({
      sucess: false,
      msg: "Invalid Token Please log in",
    });
  }

  const user = JWT.verify(process.env.JWT_SECRET, token);

  req.user = user;

  next();
};
