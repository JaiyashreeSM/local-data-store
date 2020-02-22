// import libraries
let fs = require('fs');
const path = require('path');
const getSize = require('get-folder-size');

// import app files
const constants = require('../utils/constants');
const ErrorConstants = require('../utils/error');
const { ErrorHandler } = require('../helper/error');
const localFileSystem = require('../utils/local-file-system')
const validator = require('../utils/validator')

// declare and initialize variables

/**
 * Class DataStoreService - Create 
 * @author Jaiyashree Subramanian
 */
module.exports = class DataStoreService {

  /**
   * Parameterized constructor for the Data Store service
   * 
   * @param {String} fileName - File Name where the data store is set
   */
  constructor(fileName) {
    // super();
    this.filePath = process.env.DATA_STORE_PATH || constants.DEFAULT_FILE_PATH;
  }

  async get(key, callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${key}`);
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        return callback(new ErrorHandler(404, 'Key Not Found'));
      }
      let data = JSON.parse(await localFileSystem.readFile(filePath));
      if(data.expire && data.expire <= Date.now()) { // evaluate ttl
        await localFileSystem.removeFile(filePath);
        return callback(new ErrorHandler(404, 'Key Not Found'));
      }
      return (data.value);
    } catch(error) {
      callback(error);
    }
  }

  async set(data, callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${data.key}`);
      let {valueSize, fileContent} = await validator.validateKV(data);
      const isExist = await localFileSystem.fileExists(filePath);
      if(isExist) {
        return callback(new ErrorHandler(406, 'Key Already Exists'));
      }
      const sizeDS = await new Promise((resolve, reject) => {
        getSize(path.join(__dirname, this.filePath), (err, dirSize) => {
          if(err) reject(err);
          resolve(dirSize);
        });
      });
      if((sizeDS + valueSize) >= 1073741824) { // byte convertion to 1 GB
        return callback(new ErrorHandler(406, 'No space left on data-store'));
      }
      await localFileSystem.writeFile(filePath, JSON.stringify(fileContent));
      return (data.value);
    } catch(error) {
      callback(new ErrorHandler(error));
    }
  }

  async remove(key, callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${key}`);
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        return callback(new ErrorHandler(404, 'Key Not Found'));
      } else {
        const data = JSON.parse(await localFileSystem.readFile(filePath));
        if(data.expire && data.expire <= Date.now()) { // evaluate ttl
          await localFileSystem.removeFile(filePath);
          return callback(new ErrorHandler(404, 'Key Not Found'));
        }
      }
      await localFileSystem.removeFile(filePath);
      return (`Key - ${key} is deleted from data-store`);
    } catch(error) {
      callback(error);
    }
  }
};