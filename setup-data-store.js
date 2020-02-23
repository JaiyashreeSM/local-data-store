const fs = require('fs');
const path = require('path');
const logger = require('winston');
const constants = require('./utils/constants');
const filePath = process.env.DATA_STORE_PATH || constants.DEFAULT_FILE_PATH
const dsFilePath = path.join(__dirname, filePath);

const createDS = () => {
  try {
    if(!fs.existsSync(dsFilePath)) {
      fs.mkdirSync(dsFilePath);
      if(!fs.existsSync(`${dsFilePath}ttl.json`))
        fs.writeFileSync(`${dsFilePath}ttl.json`, "{}", constants.ENCODING);
      logger.info('Set test-data-store successfuly');
    }
  } catch(error) {
    console.log(error)
    logger.error('Error while setting test-data-store');
  }
}

createDS();