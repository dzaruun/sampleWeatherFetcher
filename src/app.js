const path = require('path'),
       expressRuntime = require('express')
       geocode = require('../statics/js/geocode'),
       forecast = require('../statics/js/forecast'),
       expressServer = expressRuntime(),
       viewsManager = require('hbs'),/** this is needed for the views configuration, partials; notrequired initially, the view engine is sufficient */
       port = 2050,
       curr = __dirname,
       staticPath = path.join(curr,'../statics'), //paths is nodes module for path manipulation. Does not do much so far!
       viewsPath = path.join(curr,'../templates/views'),
       partialsPath = path.join(curr,'../templates/parts'),
       terminate = (obj, res) => {res.send(obj);return};

// serve the whole static directory
expressServer.use(expressRuntime.static(staticPath));

//// views management part
// setting the view engine (handrails), imported as hbs
expressServer.set('view engine','hbs');
// customizing the views location, by default without customization it is 'views'
expressServer.set('views', viewsPath);
viewsManager.registerPartials(partialsPath);

////routing
let defaultParams = {title:'Sample Title', summary:'Sample Summary', author:'Sharunas'};
let viewName = '';
expressServer.get('', (req, res)=>{
    res.render('trivial', { /*parameters to be used by the template*/
      title:'Sample title',
      summary: 'Sample summary',
      author: 'Sharunas',
      scriptName:'indexScript'
    });
  });
  viewName = 'help';
  expressServer.get('/help', (req, res)=>{
      res.render('trivial', {...defaultParams, 
        title:'Sample HELP title',
        summary: 'You wont receive any help!',
        scriptName:'helpScript'
    });
  });
  expressServer.get(`/about`, (req, res)=>{
      res.render('aboutView', { ...defaultParams, 
            title:'Sample ABOUT title',
            summary: 'To be filled up with self-praising!',
            scriptName:'aboutScript'
      });
  });
  viewName = 'weather';
  expressServer.get('/weather', (req, res)=>{
    res.render('weatherView', { ...defaultParams, 
                 title:'Supposed to return weather',
                 summary: 'The actual functionality',
                 location:'Dublin',
                 scriptName:'weatherScript'
    });
  });


  expressServer.get('/weatherEndpoint', (req, res)=>{
    let qr = req.query;
    !qr.address && terminate({ error: 'You did not enter address' }, res);
    geocode(qr.address, (err, {latitude, longitude, location}={})=>{ // see defaulting to an empty object
      if (err) {
        terminate({error:err}, res);
        return;
      };
      if (!latitude || !longitude) {
       terminate({error:'invalid location'}, res);
       return;
      }

      forecast(latitude, longitude, (err, castData) =>{
        err && terminate({ 'error':err }, res);
        let responseJSON = {forecast:castData,
                            location, // destructuring - same named props resolve into like location:location
                            address: qr.address};
        res.send(JSON.stringify(responseJSON));
       });
    });
  });

  // partial match to serve a bit more rerouted 404 pages just for some routes    
  expressServer.get('/help/*', (req, res)=>{
    res.send('<h1>HELP ITEM NOT FOUNDD</h1>');
  });
  expressServer.get('*', (req, res)=>{
    res.render('404View', {...defaultParams, url:req.url}); 
  });

expressServer.listen(port, ()=>console.info(`listening on port ${port}`));