
//http://api.wunderground.com/api/1e34f936f2664683/conditions/q/CA/San_Francisco.json

// const URL = "http://api.wunderground.com/api/1e34f936f2664683/conditions/q/CA/San_Francisco.json"

const request = require('request');
const mongoose = require('mongoose');

exports.getMany = (features) => {
  console.log(`Getting ${features}`)
}

exports.getHistory = (stationID) => {

}

exports.get10DayForecast = (stationID, apiKey, callback) => {

  request.get(
    `http:\/\/api.wunderground.com/api/${apiKey}/forecast10day/q/pws:${stationID}.json`,
    (err, response, body) => {
      callback(body);
    }
  );

  //SAMPLE
  // const sampleData = require('./sample-weather-data');
  // callback(sampleData);
}
