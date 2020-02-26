const fs = require('fs');
const path = require('path');
const logger = require('winston');
const constants = require('../utils/constants');
const dsFilePath = constants.DEFAULT_FILE_PATH;

const clearDS = () => {
  try {
    if( fs.existsSync(dsFilePath) ) {
      fs.readdirSync(dsFilePath).forEach(function(file, index){
        var curPath = `${constants.DEFAULT_FILE_PATH}${file}`;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          clearDS(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dsFilePath);
    }
    logger.info('Cleared test-data-store successfuly');
    setDS();
  } catch(error) {
    logger.error('Error while clearing test-data-store');
  }
};

const setDS = () => {
  try {
    fs.mkdirSync(dsFilePath);
    if( fs.existsSync(dsFilePath) ) {
      fs.writeFileSync(`${dsFilePath}ttl.json`, "{}", constants.ENCODING);
      logger.info('Set test-data-store successfuly');
    }
  } catch(error) {
    console.log(error)
    logger.error('Error while setting test-data-store');
  }
}

clearDS();