const request = require('request'),
       weatherUrlBase = 'https://api.darksky.net/forecast/73a87d80e7539f5f13282505f8e94810/',//37.8267,-122.4233';
         connectionError = 'Unable to connect to weather service!',
           dataError = 'Unable to find location';

const forecast = (latitude, longitude, callback) => {
    const weatherUrl = `${weatherUrlBase}${longitude},${latitude}?units=si`;//&lang=ru`,
      doAndExit = (err,data)=>{
          callback(err,data);
          return;
      }
    request({ url: weatherUrl, json: true }, (error, { body }) => { // see destructuring - response.body is expected and destructured
      error && doAndExit(connectionError);
      //console.info('FULL FORECAST BODY:', body);
      body.error && doAndExit(dataError);
      let currently = body.currently;
      let outputString = `${body.daily.data[0].summary}\nIt is currently ${currently.temperature} °C out.\nThere is a ${currently.precipProbability} % chance of rain.\n Wind speed is ${currently.windSpeed}`
      callback(null, outputString);
    })
}

module.exports = forecast