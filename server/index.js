var express = require('express');
var wagner = require('wagner-core');

// Intialize dependencies (register services - Models)
require('./models')(wagner);

var app = express();

// Serve the client-side files
app.use('/', express.static('client'));

// Authentication
wagner.invoke(require('./auth'), { app: app });

// Use API subrouter for API requests
app.use('/api', require('./api')(wagner));


// Initiate server
app.listen(3000, function() {
	console.log('Server listening on port 3000');	
});

