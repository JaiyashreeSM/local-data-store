module.exports = class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};