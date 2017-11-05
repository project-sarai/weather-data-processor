const mongoose = require('mongoose');

const WeatherStationsSchema = new mongoose.Schema({
  id: String,
  coords: [Number, Number],
  label: String,
  shortLabel: String,
  group: String,
  enabled: Boolean,
  region: String
});

module.exports = mongoose.model('WeatherStations', WeatherStationsSchema, 'weather-stations');
