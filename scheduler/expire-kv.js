const { CronJob } = require('cron');
const logger = require('winston');
const fs = require('fs');
const path = require('path');

const { ErrorHandler } = require('../helper/error');
let DataStore = require('../service/data-store');
const constants = require('../utils/constants');

class ExpireKeyValueScheduler {

  async start() {
    try {
      this.job = new CronJob('00 */1 * * * *', async () => { // every 15 minutes
        this.filePath = process.env.DATA_STORE_PATH || constants.DEFAULT_FILE_PATH;
        this.ttlFilePath = path.join(__dirname, `${this.filePath}ttl.json`);
        let ds = new DataStore();
        await ds.removeExpiredKeys();
        logger.info('Expired k-v job started at');
      }, null, true, 'Asia/Kolkata');
      this.job.start();
    } catch (err) {
      throw new ErrorHandler(err);
    }
  }
}

const expireKeyValueJob = new ExpireKeyValueScheduler();
expireKeyValueJob.start();