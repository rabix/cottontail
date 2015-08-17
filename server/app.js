/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var _ = require('lodash');

var Store = require('./components/store');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var winston = require('./components/logger');


// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);
// Populate DB with sample data
if (config.seedDB) {
    require('./config/seed');
}

if (config.strategy === 'local') {
    var dir = config.store.path;

    if (dir.charAt(dir.length - 1) !== '/') {
        dir = dir + '/';
    }

    Store.fs.mkdir(dir + 'local/').then(function () {
        Logger.info('User dir created.');
    }, function () {
        Logger.info('User dir already set.');
    });

}

// Setup server
var app = express();
var server = require('http').createServer(app);
//var socketio = require('socket.io')(server, {
//    serveClient: config.env !== 'production',
//    path: '/socket.io-client'
//});

//require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

/**
 * All errors are intercepted here and formated
 */
app.use(function (err, req, res, next) {

    console.error('Caught err: ', err);
    winston.error({
        route: req.url || req.originalRoute,
        status: err.status || 500,
        error: err.body,
        message: err.message || 'Request parse error'
    });

    var error = {message: err.message, stack: err.stack};
    for (var prop in err) error[prop] = err[prop];

    res.setHeader('Content-Type', 'application/json');
    res.status(err.status || 500).json({error: error});
});

// Expose app
exports = module.exports = app;
