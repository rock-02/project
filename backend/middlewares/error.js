const ErrorHandler = require("../utils/errorHandler");

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  res.status(err.statusCode).json({
    sucess: false,
    error: err.message,
    stack: err.stack,
  });
};

module.exports = errorMiddleware;
