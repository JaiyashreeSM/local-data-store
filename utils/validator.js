var sizeof = require('sizeof'); 
const { ErrorHandler } = require('../helper/error');

const validateKV = async(data, callback) => {
  try {
    return new Promise(async(resolve, reject) => {
      if(data.key.length !== 32) // key capped to 32 characters
        reject(new ErrorHandler(406, 'Key must be 32 characters in length'));
      if(sizeof.sizeof(data.value) > 16384) // value capped to 16KB
        reject(new ErrorHandler(406, 'Value must not exceed 16KB'));
      if(data.ttl) {
        const {valueSize, fileContent} = await validateTTL(data, callback); 
        resolve({valueSize, fileContent});
      } else { 
        const valueSize = sizeof.sizeof({value: data.value}); 
        resolve({valueSize, fileContent: {value: data.value}});
      }
    });
  } catch(error) {
    callback(new ErrorHandler(error));
  } 
}

const validateTTL = (data, callback) => {
  try {
    return new Promise((resolve, reject) => {
      if(typeof data.ttl !== 'number' || data.ttl < 0) { // ttl must be valid positive integer
        reject(new ErrorHandler(406, 'ttl must be valid number representing number of seconds'));
      }
      let expire = Date.now() + (data.ttl * 1000); // calculate expiry time
      let valueSize = sizeof.sizeof({value: data.value, expire}); 
      resolve({valueSize, fileContent: {value: data.value, expire}});
    });
  } catch(error) {
    callback(new ErrorHandler(error));
  } 
}

module.exports = {
  validateKV,
  validateTTL
};