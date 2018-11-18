/* NODEJS entry file */
var express = require('express'),
	app = express(),
	cons = require('consolidate'),
	path =  require('path'),
	swig = require('swig'),
	port = process.env.PORT || 5000;


// Register our templating engine
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Express middleware to serve static files
app.use(express.static(__dirname + '/assets'));
//app.use(express.static(path.join(__dirname, '/')))
app.use('/lity', express.static(path.join(__dirname, 'node_modules/lity/')));

// Import the routes file
require('./routes/main.js')(express, app);
require('./routes/scenarios.js')(express, app);
require('./routes/topics.js')(express, app);
require('./routes/maps.js')(express, app);
require('./routes/energy101.js')(express, app);

// Listen to the port
app.listen(port, function() {
    console.log('Node app is running on port',
    port);
});

/*
var fs = require('fs'),
https = require('https');

https.createServer({
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem')
}, app).listen(55555);
*/