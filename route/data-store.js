let express = require('express');
let router = express.Router();
let DataStore = require('../service/data-store');
let app = express();

router.use(function(req, res, next) {
  // do logging
  // console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

/**
 * API to get a document by its key from a collection in data-store
 */
router.get('/:key', async(req, res, next) => {
  try {
    const dataStore = new DataStore();
    const data = await dataStore.get(req.params.key, next);
    if(data) res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

/**
 * API to get a document by its key from a collection in data-store
 */
router.post('/', async(req, res, next) => {
  try {
    const dataStore = new DataStore();
    const data = await dataStore.set(req.body, next);
    if(data) res.status(201).send(`Created k:v pair with key - ${req.body.key}`);
  } catch (error) {
    return next(error)
  }
})

/**
 * API to get a document by its key from a collection in data-store
 */
router.delete('/:key', async(req, res, next) => {
  try {
    const dataStore = new DataStore();
    const data = await dataStore.remove(req.params.key, next);
    if(data) res.status(200).send(data);
  } catch (error) {
    return next(error)
  }
})

module.exports = router;
