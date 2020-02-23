var appRoot = require('app-root-path');

module.exports = {
  DEFAULT_FILE_PATH: `${appRoot}/DB-store/${process.env.NODE_ENV}/`,
  ENCODING: 'utf8'
};