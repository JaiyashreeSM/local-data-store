# Local-Data-Store

This is a local-file-system based node library which works as a key-value database.

## Getting Started



To use data-store as a dependency 

```shell
npm i JaiyashreeSM/local-data-store#master
```

## Usage

```js
// import
const DataStore = require('data-store');
const dataStore = new DataStore();

// to set data
const data = await dataStore.set({
  "key": "abc12345678901234567890123456789",
  "value": { "name": "data-store" }
  "ttl": 3600
}, next);

// to get data
const data = await dataStore.get("abc12345678901234567890123456789", next);

// to remove data from data-store
const result = await dataStore.remove("12345678901234567890123456789012", next);

// to remove all expired key from data-store
const data = await dataStore.removeExpiredKeys();
```
Optionally, the path to the data-store can be set from node-environment, else it takes the default path in the app-root directory ({appRoot}/DB-store/dev/). 
To set different path .env or the following export command.
```shell
export DATA_STORE_PATH=/home/workspace/learnings/
```

## Validations
1. key - must be a valid 32 characters length alpha-numeric string
2. value - must be a valid json less than 16KB
3. ttl (optional) - must be a valid integer representing Time-To-Live in Seconds

## Contributing
This is a beta version trial application and pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)