// import required modules
let fs = require('fs');

// import local exports
const constants = require('../utils/constants');

/**
 * Wrapper function for checking if a file exist in the file-path
 * 
 * @param {string} filePath - path to check if the file exists
 * @author Jaiyashree Subramanian
 */
const fileExists = async(filePath) => {
  return new Promise((resolve) => {
    fs.exists(filePath, function(exists) {
      resolve(exists);
    });
  });
}

/**
 * Wrapper function for reading file from the file-path
 * 
 * @param {string} filePath - path to read file
 * @author Jaiyashree Subramanian
 */
const readFile = async(filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, constants.ENCODING, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

/**
 * Wrapper function for writing file into the file-path
 * 
 * @param {string} filePath - path to write the file
 * @author Jaiyashree Subramanian
 */
const writeFile = async(filePath, fileData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileData, constants.ENCODING, (err) => {
      if (err) {
        reject(err);
      }
      resolve('Done');
    });
  });
}

/**
 * Wrapper function for to remove a file with path specified
 * 
 * @param {string} filePath - path to file to be removed
 * @author Jaiyashree Subramanian
 */
const removeFile = async(filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(err);
      }
      resolve('Done');
    });
  });
}

module.exports = {
  fileExists,
  readFile,
  writeFile,
  removeFile,
};
