// Middleware - Error handler

/**
 * User defined class to construct and throw error
 * with appropriate status code and error message.
 */

const handleError = (err, res) => {
  if(err) {
    res.status(err.statusCode).json({
      status: "error",
      statusCode : err.statusCode,
      message : err.message
    });
  }
};

module.exports = {
  handleError
}
