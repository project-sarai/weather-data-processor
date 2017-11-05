const mongoose = require('mongoose');

const WeatherDataSchema = new mongoose.Schema({
  id: String,
  date: {
    year: Number,
    month: Number,
    day: Number
  },
  data: {
    temp: {
      ave: Number,
      min: Number,
      max: Number
    },
    pressure: {
      min: Number,
      max: Number
    },
    wind: {
      maxSpd: Number,
      aveSpd: Number,
      gustMaxSpd: Number
    },
    humidity: {
      ave: Number,
      min: Number,
      max: Number
    },
    rainfall: Number
  },
  dateUTC: Date
});

module.exports = mongoose.model('WeatherData', WeatherDataSchema, 'weather-data');
