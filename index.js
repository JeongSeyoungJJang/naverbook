const CronJob = require("cron").CronJob;
const worker = require("./news/naver_news");
new CronJob("*/1 * * * *", worker.naverNews, null, true, "America/Los_Angeles")