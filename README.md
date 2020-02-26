# Local-Data-Store as "Service"

This is a node application which uses local-file-system as a key-value database.

## Getting Started


```shell
git clone https://github.com/JaiyashreeSM/local-data-store.git
cd local-data-store
```
Using node and npm
```shell
npm install
npm start
npm run test
```
(OR)</br>
Using Docker and docker-compose
```shell
docker-compose build api
docker-compose run --rm api npm install
docker-compose up api
```

To run a job to remove expired keys from data-store
```shell
npm run expire-kv
```
(OR)
```shell
docker-compose run --rm api npm run expire-kv
```

## Usage
Refer - [local-data-store](https://github.com/JaiyashreeSM/local-data-store)

## Contribution
This is a beta version trial application and pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)