// import libraries
const getSize = require('get-folder-size');
const logger = require('winston');

// import app files
const constants = require('../utils/constants');
const ErrorHandler = require('../utils/error');
const localFileSystem = require('../utils/local-file-system')
const validator = require('../utils/validator')
require('./init');

/**
 * Class DataStoreService - Create 
 * @author Jaiyashree Subramanian
 */
module.exports = class DataStoreService {

  /**
   * Constructor for the Data Store service to set data-store file path and 
   * ttl-file path.
   * 
   * @author Jaiyashree Subramanian
   */
  constructor() {
    // super();
    this.filePath = process.env.DATA_STORE_PATH || constants.DEFAULT_FILE_PATH;
    this.ttlFilePath = `${this.filePath}ttl.json`;
  }

  /**
   * Function to get a value by its key after checking its ttl.
   * 
   * @param {string} key - key to fetch the corresponding value
   * @param {function} next - callback
   * @author Jaiyashree Subramanian
   */
  async get(key, next) {
    try {
      const filePath = `${this.filePath}${key}`;
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        throw(new ErrorHandler(404, 'Key Not Found'));
      }
      let data = JSON.parse(await localFileSystem.readFile(filePath));
      let isExpired = await this.evaluateTTL(key);
      if(isExpired) { // evaluate ttl
        throw(new ErrorHandler(404, 'Key Not Found'));
      }
      return (data);
    } catch(error) {
      next(error);
    }
  }

  /**
   * Function to set a k-v, its ttl after checking the validations.
   * 
   * @param {object} data - req.body from the http request
   * @param {function} next - callback
   * @author Jaiyashree Subramanian
   */
  async set(data, next) {
    try {
      const filePath = `${this.filePath}${data.key}`;
      let writeSize = await validator.validateKV(data);
      const isExist = await localFileSystem.fileExists(filePath);
      if(isExist) {
        throw (new ErrorHandler(406, 'Key Already Exists'));
      }
      const sizeDS = await new Promise((resolve, reject) => {
        getSize(this.filePath, (err, dirSize) => {
          if(err) reject(err);
          resolve(dirSize);
        });
      });
      if((sizeDS + writeSize) >= 1073741824) { // byte convertion of 1 GB
        throw (new ErrorHandler(406, 'No space left on data-store'));
      }
      await localFileSystem.writeFile(filePath, JSON.stringify(data.value));
      if(data.ttl) {
        let ttlData = JSON.parse(await localFileSystem.readFile(this.ttlFilePath));
        ttlData[data.key] = data.expire;
        await localFileSystem.writeFile(this.ttlFilePath, JSON.stringify(ttlData));
      }
      return (data.value);
    } catch(error) {
      next(error);
    }
  }

  /**
   * Function to remove a k-v, by using key after validating ttl.
   * 
   * @param {string} key - key to find and remove kv
   * @param {function} next - callback
   * @author Jaiyashree Subramanian
   */
  async remove(key, next) {
    try {
      const filePath = `${this.filePath}${key}`;
      const isExist = await localFileSystem.fileExists(filePath);
      if(!isExist) {
        throw (new ErrorHandler(404, 'Key Not Found'));
      }
      let isExpired = await this.evaluateTTL(key);
      if(isExpired) { // evaluate ttl
        throw (new ErrorHandler(404, 'Key Not Found'));
      }
      await localFileSystem.removeFile(filePath);
      let ttlData = JSON.parse(await localFileSystem.readFile(this.ttlFilePath));
      if(ttlData[key]) { // re-write ttl file
        delete ttlData[key];
        await localFileSystem.writeFile(this.ttlFilePath, JSON.stringify(ttlData));
      }
      return (`Key - ${key} is deleted from data-store`);
    } catch(error) {
      next(error);
    }
  }

  /**
   * Function to evaluate the TTL of a key and remove if it had expired
   * 
   * @param {string} key - key to evaluate ttl
   * @author Jaiyashree Subramanian
   */
  async evaluateTTL(key) {
    try {
      const filePath = `${this.filePath}${key}`;
      let ttlData = JSON.parse(await localFileSystem.readFile(this.ttlFilePath));
      if(ttlData[key] && ttlData[key] <= Date.now()) { // evaluate ttl
        await localFileSystem.removeFile(filePath);
        delete ttlData[key];
        await localFileSystem.writeFile(this.ttlFilePath, JSON.stringify(ttlData));
        return true;
      }
      return false;
    } catch (error) {
      logger.error(error);
      throw(error);
    }
  }

  /**
   * Function to iterate and delete all expired key from data-store
   * 
   * @author Jaiyashree Subramanian
   */
  async removeExpiredKeys() {
    try {
      let ttlData = JSON.parse(await localFileSystem.readFile(this.ttlFilePath));
      Object.keys(ttlData).map(async(item) => {
        if(ttlData[item] <= Date.now()) {
          const filePath = `${this.filePath}${item}`;
          const isExist = await localFileSystem.fileExists(filePath);
          if(isExist) {
            await localFileSystem.removeFile(filePath);
            let updatedTtlData = JSON.parse(await localFileSystem.readFile(this.ttlFilePath));
            delete updatedTtlData[item];
            await localFileSystem.writeFile(this.ttlFilePath, JSON.stringify(updatedTtlData));
          }
        }
      });
      return 'Completed a cycle';
    } catch (err) {
      logger.error(err)
      throw (err);
    }
  }
};