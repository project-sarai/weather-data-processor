
// connect to DB, get WU station ids

// iterate through items, fetch data from WU
// insert weather data into database
// compute last 30 days of rainfall, insert into database

// generate tweet
// tweet to project sarai

// modes: daily-fetch + tweet, fetch-one, fix empty

const mongoose = require('mongoose');
const CONFIG = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.DB_URL, (err) => {
  if (err) { console.log('Error connecting to MongoDB'); }
  else { console.log('Connected to MongoDB'); }
});

// Register models
require('./models/index');

// daily-fetch
require('./modes/daily/index')();

