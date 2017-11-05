
const CONFIG = require('../../config');
const wu = require('../../lib/wunderground-api');
const mongoose = require('mongoose');
const async = require('async');
const twitter = require('../../lib/twitter');

const stationsAsync = (callback) => {
  const WeatherStations = mongoose.model('WeatherStations');
  WeatherStations.find({ group: 'SARAI', enabled: true }, (err, stations) => {
    if (err) {
      callback('Error getting stations', null);
    }
    callback(null, stations);
  })
}

const settingsAsync = (callback) => {
  const DSSSettings = mongoose.model('DSSSettings')
  DSSSettings.find({ name: 'wunderground-api-key' }, (err, record) => {
    if (err) {
      callback('Error getting settings', null);
    }
    callback(null, record)
  });
}


module.exports = () => {

    async.parallel({stations: stationsAsync, settings: settingsAsync}, (err, results) => {
      if (err) { console.log(err); }

      const { stations, settings } = results;
      fetchDailyData(stations, settings[0].value);

      // SAMPLE DATA
      // const stations = [ { id: 'ICALABAR6' } ]
      // const { settings } = results;
      // fetchDailyData(stations, settings[0].value);
    });

}

const fetchDailyData = (stations, apiKey) => {


  async.eachSeries(stations,
    (station, done) => {
      setTimeout(function() {
        wu.get10DayForecast(station.id, apiKey, (result) => {

          let simpleforecast = null;

          try {
            simpleForecast = JSON.parse(result).forecast.simpleforecast.forecastday
          } catch(e) {
            console.log('No data for ' + station.id);
            done();
          }

          const today = simpleForecast[0]

          const location =  station.shortLabel ? station.shortLabel : sanitizeLabel(station.label);
          const date = today.date.day;
          const month = today.date.month;
          const temp_high_c = today.high.celsius;
          const pop = today.pop;
          const qpf_mm = today.qpf_allday.mm
          const next7Days = getNext7Days(simpleForecast);

          async.waterfall([
            function(done) {
              const accumulated30Days = get30DaysAccumulated(station.id, done);
            },
            function(accumulated30Days, done) {
              const advisory = formatAdvisory(location, month, date, temp_high_c, pop, qpf_mm, accumulated30Days, next7Days);

              done(null, advisory);
            },
            function(advisory, done) {
              twitter.update(advisory, done);
            }
          ]);

          done();
        });
      }, 10*1000); // Once every 10 seconds
    },
    (err) => {
      if (err) { console.log(err); }

      console.log('Finished!');
      mongoose.disconnect();
    });
}


const getNext7Days = (simpleforecast) => {
  const forecast = simpleforecast.slice(1, 8);
  let total = 0;

  forecast.forEach((e, i) => {
    total += e.qpf_allday.mm;
  });

  return total;
}

const get30DaysAccumulated = (stationID, done) => {
  const WeatherData = mongoose.model('WeatherData');

  const oneMonthAgo = new Date();
  let reverseOffset = oneMonthAgo.getDate() - 31

  if (reverseOffset > 32 || reverseOffset < -32) {
    reverseOffset = -(31 - oneMonthAgo.getDate())
  }

  oneMonthAgo.setDate(reverseOffset)

  WeatherData
    .find({ id: stationID, dateUTC: { $gt: oneMonthAgo }})
    .sort({ dateUTC: -1 })
    .exec((err, results) => {
      if (err) { console.log(err); }

      let total = 0;
      results.forEach((e, i) => {
        total += e.data.rainfall;
      });

      total = Math.round((total * 10) / 10);
      done(null, total);
    });
}


const formatAdvisory = (location, month, date, temp_high_c, pop, qpf_mm, accumulated30Days, next7Days) => {

  return `ADVISORY ${location} ${month}/${date}. High ${temp_high_c}C. Rainfall: ${pop}% chance of ${qpf_mm > 1 ?  qpf_mm : '<1' }mm rain. Past 30 days: ${accumulated30Days}mm. Next 7 days: ${next7Days}mm.`
}

const sanitizeLabel = (label) => {
  label = label.replace('SARAI', '')
  label = label.replace('(UPLB)', '')
  label = label.replace('WFP', '')
  label = label.replace('WPU', '')
  label = label.replace('APN', '')
  label.trim()

  return label;
}