// import libraries
let fs = require('fs');
const path = require('path');

// import app files
const constants = require('../utils/constants');
const ErrorConstants = require('../utils/error');
const {ErrorHandler} = require('../helper/error');
const localFileSystem = require('../utils/local-file-system')

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
    this.dataFie = `${fileName}.json`;
  }

  async getAll(callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${this.dataFie}`);
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        return callback(new ErrorHandler(404, 'Collection Not Found'));
      }
      const data = await localFileSystem.readFile(filePath);
      return (JSON.parse(data));
    } catch(error) {
      callback(error);
    }
  }

  async get(key, callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${this.dataFie}`);
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        return callback(new ErrorHandler(404, 'Collection Not Found'));
      }
      const data = JSON.parse(await localFileSystem.readFile(filePath))[key];
      if(!data) {
        return callback(new ErrorHandler(404, 'Key Not Found'));
      }
      return (data);
    } catch(error) {
      callback(error);
    }
  }

  async set(data, callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${this.dataFie}`);
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        return callback(new ErrorHandler(404, 'Collection Not Found'));
      }
      const fileContent = JSON.parse(await localFileSystem.readFile(filePath));
      if(fileContent[data.key]) {
        return callback(new ErrorHandler(406, 'Key Already Exists'));
      }
      fileContent[data.key] = data.value;
      await localFileSystem.writeFile(filePath, fileContent);
      return (data);
    } catch(error) {
      callback(error);
    }
  }

  async remove(key, callback) {
    try {
      const filePath = path.join(__dirname, `${this.filePath}${this.dataFie}`);
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        return callback(new ErrorHandler(404, 'Collection Not Found'));
      }
      const fileContent = JSON.parse(await localFileSystem.readFile(filePath));
      if(!fileContent[key]) {
        return callback(new ErrorHandler(404, 'Key Not Found'));
      }
      delete fileContent[key];
      await localFileSystem.writeFile(filePath, fileContent);
      return (data);
    } catch(error) {
      callback(error);
    }
  }
};