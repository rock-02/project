const sendToken = (user, res, statusCode) => {
  const token = user.getJwtToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  
  res.status(statusCode).cookie("token", token, cookieOptions).json({
    sucess: true,
    token: token,
    msg: "Token Generated",
  });
};
module.exports = sendToken;
