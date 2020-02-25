const fs = require('fs');
const logger = require('winston');
const constants = require('../utils/constants');
const dsFilePath = process.env.DATA_STORE_PATH || constants.DEFAULT_FILE_PATH

/**
 * Function to create data-store in specified path in environment or default path
 * if not already exist for the applicaion to work on.
 * 
 * @author Jaiyashree Subramanian
 */
const createDS = () => {
  try {
    if(!fs.existsSync(dsFilePath))
      fs.mkdirSync(dsFilePath);
    if(!fs.existsSync(`${dsFilePath}ttl.json`))
      fs.writeFileSync(`${dsFilePath}ttl.json`, "{}", constants.ENCODING);
    logger.info('Set data-store successfuly');
  } catch(error) {
    logger.error('Error while setting data-store');
  }
}

createDS();