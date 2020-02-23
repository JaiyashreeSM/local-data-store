const { CronJob } = require('cron');
const logger = require('winston');

const { ErrorHandler } = require('../helper/error');
let DataStore = require('../service/data-store');
const constants = require('../utils/constants');

// Cron-Job - ExpireKeyValueScheduler
class ExpireKeyValueScheduler {

  /**
   * Scheduler to runce once in every 15 minutes to delete expired key
   * in the data-store
   * 
   * @author Jaiyashree Subramanian
   */
  async start() {
    try {
      this.job = new CronJob('00 */15 * * * *', async () => { // every 15 minutes
        this.filePath = process.env.DATA_STORE_PATH || constants.DEFAULT_FILE_PATH;
        this.ttlFilePath = `${this.filePath}ttl.json`;
        let ds = new DataStore();
        logger.info(`Expired k-v job started at`);
        const result = await ds.removeExpiredKeys();
        logger.info(`${result} at `);
      }, null, true, 'Asia/Kolkata');
      this.job.start();
    } catch (err) {
      throw new ErrorHandler(err);
    }
  }
}

const expireKeyValueJob = new ExpireKeyValueScheduler();
expireKeyValueJob.start();