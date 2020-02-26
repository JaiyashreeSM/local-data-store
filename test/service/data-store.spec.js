const chai = require('chai');
const assert = chai.assert;
const logger = require('winston');
const {mockJson} = require('./test-data');

const DataStore = require('../../service/data-store');

describe('DataStoreService', () => {

  describe('Set Key-Value', () => {

    it('Set a valid key value pair without ttl', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'set_1234567890123456789012345001',
          value : {name: "random-test-json"},
        };
        const result = await dataStore.set(input)
        assert.equal(input.value.name, result.name, 'K-V inserted successfully');
      } catch(error) {
        throw(error)
      }
    });

    it('Set a valid key value pair with ttl', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'set_1234567890123456789012345002',
          value : {name: "random-test-json"},
          ttl: 3600
        };
        const result = await dataStore.set(input);
        assert.equal(input.value.name, result.name, 'K-V inserted successfully');
      } catch(error) {
        throw(error)
      }
    });

    it('Set a invalid key ', () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'set_1234',
          value : {name: "random-test-json"}
        };
        dataStore.set(input, (err) => {
          assert.equal(err.message, 'Key must be 32 characters in length', 'Error is thrown');
        })
      } catch(error) {
        logger.error(error.message)
      }
    });

    it('Set a invalid ttl ', () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'set_1234567890123456789012345003',
          value : {name: "random-test-json"},
          ttl : -1
        };
        dataStore.set(input, (err) => {
          assert.equal(err.message, 'ttl must be valid number representing number of seconds',
            'Error is thrown');
        })
      } catch(error) {
        logger.error(error.message)
      }
    });

    it('Set a invalid value more than 16KB ', () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'set_1234567890123456789012345004',
          value: mockJson
        }
        dataStore.set(input, (err) => {
          assert.equal(err.message, 'Value must not exceed 16KB', 'Error is thrown');
        })
      } catch(error) {
        logger.error(error.message)
      }
    });

  }); // end of "set"

  describe('Get Key-Value', () => {

    it('Get by using valid key without ttl', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'get_1234567890123456789012345001',
          value : {name: "random-test-json"}
        };
        await dataStore.set(input);
        const result = await dataStore.get(input.key)
        assert.equal(input.value.name, result.name, 'K-V fetched successfully');
      } catch(error) {
        throw(error)
      }
    });

    it('Get by using valid key with expired ttl', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'get_1234567890123456789012345002',
          value : {name: "random-test-json"},
          ttl : 1
        };
        await dataStore.set(input)
        setTimeout(() => {
          dataStore.get(input.key, (err, result) => {
            assert.equal(err.message, 'Key Not Found', 'Error is thrown');
          })
        }, 2000);
      } catch(error) {
        throw(error)
      }
    });

    it('Get by using invalid key', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'get_1234567890123456789012345003',
          value : {name: "random-test-json"},
        };
        dataStore.get(input.key, (err, result) => {
          assert.equal(err.message, 'Key Not Found', 'Error is thrown');
        })
      } catch(error) {
        throw(error)
      }
    });

  }); // end of "get"

  describe('Remove Key-Value', () => {

    it('Remove using valid key without ttl', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'remove_1234567890123456789012001',
          value : {name: "random-test-json"}
        };
        await dataStore.set(input);
        const result = await dataStore.remove(input.key)
        assert.equal(result, 
          `Key - ${input.key} is deleted from data-store`, 'K-V deleted successfully');
      } catch(error) {
        throw(error)
      }
    });

    it('Remove using valid key with expired ttl', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'remove_1234567890123456789012002',
          value : {name: "random-test-json"},
          ttl : 1
        };
        await dataStore.set(input)
        setTimeout(() => {
          dataStore.remove(input.key, (err, result) => {
            assert.equal(err.message, 'Key Not Found', 'Error is thrown');
          })
        }, 2000);
      } catch(error) {
        throw(error)
      }
    });

    it('Remove using invalid key', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'remove_1234567890123456789012003',
          value : {name: "random-test-json"},
        };
        dataStore.remove(input.key, (err, result) => {
          assert.equal(err.message, 'Key Not Found', 'Error is thrown');
        })
      } catch(error) {
        throw(error)
      }
    });

  }); // end of "remove"

  describe('Remove Expired KV from data-store', () => {

    it('Remove k-v with ttl expired', async () => {
      try{
        const dataStore = new DataStore();
        const input = {
          key: 'exp_1234567890123456789012456001',
          value : {name: "random-test-json"},
          ttl: 1
        };
        await dataStore.set(input);
        setTimeout(async() => {
          const result = await dataStore.removeExpiredKeys()
          assert.equal(result,`Completed a cycle`, 'Expired K-V deleted successfully');
        }, 3000);
      } catch(error) {
        throw(error)
      }
    });
  });

});