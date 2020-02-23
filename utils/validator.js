var sizeof = require('sizeof'); 
const ErrorHandler = require('../utils/error');

const validateKV = async(data, callback) => {
  try {
    return new Promise(async(resolve, reject) => {
      if(data.key.length !== 32) // key capped to 32 characters
        reject(new ErrorHandler(406, 'Key must be 32 characters in length'));
      if(sizeof.sizeof(data.value) > 16384) // value capped to 16KB
        reject(new ErrorHandler(406, 'Value must not exceed 16KB'));
      if(data.ttl) {
        if(typeof data.ttl !== 'number' || data.ttl < 0) { // ttl must be valid positive integer
          reject(new ErrorHandler(406, 'ttl must be valid number representing number of seconds'));
        }
        let expire = Date.now() + (data.ttl * 1000); // calculate expiry time
        data.expire = expire;
        let valueSize = sizeof.sizeof({value: data.value, expire}); 
        resolve(valueSize);
      } else { 
        resolve(sizeof.sizeof({value: data.value}));
      }
    });
  } catch(error) {
    callback(error);
  } 
}

module.exports = {
  validateKV,
};