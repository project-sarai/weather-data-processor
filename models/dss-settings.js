const mongoose = require('mongoose');

const DSSSettingsSchema = new mongoose.Schema({
  name: String,
  value: String // This can actually be a string or an object. I'm only defining it for use with the String type (api key)
});

module.exports = mongoose.model('DSSSettings', DSSSettingsSchema, 'dss-settings');
