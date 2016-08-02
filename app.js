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

// Import the routes file
require('./routes/main.js')(express, app);
require('./routes/caseStudies.js')(express, app);

// Listen to the port
app.listen(port, function() {
    console.log('Node app is running on port',
    port);
});
