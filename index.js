require('dotenv').config();
const mongoose = require("mongoose");
const schedule = require('node-schedule');
const scraper = require("./src/scrapers/scraper");

(async function start () {
   await mongoose.connect(process.env.DATABASE_URL);
      schedule.scheduleJob(
          '*/4 * * * *',  () => {
           scraper()
          }
      );
})()
