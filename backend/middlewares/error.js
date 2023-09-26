const ErorHandeler = require("../utils/errorHandler");

exports.errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server";

  res.json({
    sucess: false,
    msg: err.message,
    stack: err.stack,
  });
};
