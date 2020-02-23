// Middleware - Error handler

/**
 * User defined middleware to handle error
 * @param {object} err - error object
 * @param {object} res - http response object
 * 
 * @author Jaiyashree Subramanian
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
