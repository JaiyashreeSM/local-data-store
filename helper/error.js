// Middleware - Error handler

/**
 * User defined middleware to handle error
 * @param {object} err - error object
 * @param {object} res - http response object
 * 
 * @author Jaiyashree Subramanian
 */
const handleError = (err, res) => {
  console.log(err)
  if(err) {
    if(!err.statusCode) {
      err = { statusCode: 500, message: err.message };
    }
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
