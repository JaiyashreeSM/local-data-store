// Middleware - Error handler

/**
 * User defined class to construct and throw error
 * with appropriate status code and error message.
 */
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode || 500;
    this.message = message;
  }
}

const handleError = (err, res) => {
  console.log(err)
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
};

module.exports = {
  ErrorHandler,
  handleError
}