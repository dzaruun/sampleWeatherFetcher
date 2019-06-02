const request = require('request'),
       weatherUrlBase = 'https://api.darksky.net/forecast/73a87d80e7539f5f13282505f8e94810/',//37.8267,-122.4233';
         connectionError = 'Unable to connect to weather service!',
           dataError = 'Unable to find location';

const forecast = (latitude, longitude, callback) => {
    const weatherUrl = `${weatherUrlBase}${latitude},${longitude}?units=si`;//&lang=ru`,
      doAndExit = (err,data)=>{
          callback(err,data);
          return;
      }
    request({ url: weatherUrl, json: true }, (error, { body }) => { // see destructuring - response.body is expected and destructured
      error && doAndExit(connectionError);
      body.error && doAndExit(dataError);
      let currently = body.currently;
      callback(null, `${body.daily.data[0].summary} It is currently ${currently.temperature} °C out. There is a ${currently.precipProbability} % chance of rain.`);
    })
}

module.exports = forecast