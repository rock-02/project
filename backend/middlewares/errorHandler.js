const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(500).send('Error Occured');
};

module.exports = errorHandlerMiddleware;
