let express = require('express');
let router = express.Router();
let DataStore = require('../service/data-store');
let app = express();

router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

/**
 * API to get all documents from a collection in data-store
 */
router.get('/:collection', async(req, res, next) => {
  try {
    const dataStore = new DataStore(req.params.collection);
    const data = await dataStore.getAll(next);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

/**
 * API to get a document by its key from a collection in data-store
 */
router.get('/:collection/:key', async(req, res, next) => {
  try {
    const dataStore = new DataStore(req.params.collection);
    const data = await dataStore.get(req.params.key, next);
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

/**
 * API to get a document by its key from a collection in data-store
 */
router.post('/:collection', async(req, res, next) => {
  try {
    const dataStore = new DataStore(req.params.collection);
    await dataStore.set(req.body.data, next);
    res.status(201).send(`Created k:v pair with key - ${data.key}`);
  } catch (error) {
    return next(error)
  }
})

/**
 * API to get a document by its key from a collection in data-store
 */
router.delete('/:collection/:key', async(req, res, next) => {
  try {
    const dataStore = new DataStore(req.params.collection);
    await dataStore.remove(req.body.key, next);
    res.status(204).send(`Deleted key - ${req.params.key} from store`);
  } catch (error) {
    return next(error)
  }
})

module.exports = router;
