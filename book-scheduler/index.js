const CronJob = require("cron").CronJob;
const worker = require("./news/naver_news");
const dotenv = require("dotenv");
dotenv.config({
    path: "./"
});
worker.naverNews();
// new CronJob("5,35 * * * *", worker.naverNews, null, true, "America/Los_Angeles")