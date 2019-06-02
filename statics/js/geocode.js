const request = require('request'),
        geoUriBase = 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
        geoUriToken = 'access_token=pk.eyJ1Ijoic2hhcm9vbnVpIiwiYSI6ImNqd2M1MXpvZDBtaHkzeW1nNGlhNWdmanEifQ.EBwhltlNzWrc86Qd3pPPhQ&limit=1';

const geocode = (address, callback) => {
    let geoUrl = `${geoUriBase}${encodeURIComponent(address)}.json?${geoUriToken}`,
      doAndTerminate = (err) => { callback({'error':err}, null); return; }
 
    request({ url: geoUrl, json: true }, (error, res) => {
       if (error) {
         doAndTerminate('Unable to connect to location services!', undefined); // handle connection error first; 
         return;
       }
       let geodata = res.body.features, // guarranteed there but might be none if search error
         location = geodata && geodata[0];
       if (!location  || geodata.length === 0) {
         callback('Unable to find location. Try another search.', undefined);
       } else {
        callback(null, {
                 latitude: location.center[0],
                 longitude: location.center[1],
                 location: location.place_name
             });
       }
    });
}

module.exports = geocode;