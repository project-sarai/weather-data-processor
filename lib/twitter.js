const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: 'nrwo391luTZ9ii9RCTQN0ck0t',
  consumer_secret: '3jF9SEODapddllrd2aAaZowWWvZ3pmam772VnaQPIoPJ0EwQw2',
  access_token_key: '786031807665844224-l2adT58JaY4gjAzZHSi7OPjroAXX0g9',
  access_token_secret: 'zqayJz25TT1OqylIRImdoi3GOLPOcMQ7dV2M7b5LPU8Oo'
});

exports.update = (content, done) => {
  client.post('statuses/update', { status: content },  function(err, tweet, response) {
    if(err) { console.log(err); }
    console.log('Tweeted: ' + content);  // Tweet body.
    done();
  });
}