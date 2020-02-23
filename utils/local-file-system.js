// import required modules
let fs = require('fs');
const getSize = require('get-folder-size');

// import local exports
const constants = require('../utils/constants');

const fileExists = async(filePath) => {
  return new Promise((resolve, reject) => {
    fs.exists(filePath, function(exists) {
      resolve(exists);
    });
  });
}

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

const listFiles = async(filePath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        reject(err);
      }
      resolve(files);
    });
  });
}

module.exports = {
  fileExists,
  readFile,
  writeFile,
  removeFile,
  listFiles
};
