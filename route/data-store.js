let express = require('express');
let router = express.Router();
let DataStore = require('../service/data-store');
let app = express();

router.use(function(req, res, next) {
  next(); // to make sure the call is returned to next level
});

/**
 * API to get a k-v by its key from a collection in data-store
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
 * API to set a k-v into data-store
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
 * API to delete a value data-store by its key
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
