/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var validationComponent = require('./components/validation');

/* The path argument needs to be set before the environment config is loaded */
if (typeof process.argv[2] !== 'undefined') {
    var pathArgument = process.argv[2];
    validationComponent.validateWorkingDir(pathArgument);
    process.env.WORKING_DIR = pathArgument;
}
console.log('WORKING_DIR is '+ process.env.WORKING_DIR);

var _ = require('lodash');
var Store = require('./components/store');
var express = require('express');
var config = require('./config/environment');
var logger = require('./components/logger');
var bodyParser = require('body-parser');

if (config.strategy !== 'local') {
    // Connect to database only if strategy is different then local
    var mongoose = require('mongoose');

    mongoose.connect(config.mongo.uri, config.mongo.options);
    mongoose.connection.on('error', function (err) {
            console.error('MongoDB connection error: ' + err);
            process.exit(-1);
        }
    );
}

// Populate DB with sample data
if (config.seedDB && config.strategy !== 'local') {
    require('./config/seed');
}

if (config.strategy === 'local') {
    var dir = config.store.path;

    if (dir.charAt(dir.length - 1) !== '/') {
        dir = dir + '/';
    }

    Store.fs.mkdir(dir).then(function () {
        Logger.info('Working dir created.');
    }, function () {
        Logger.info('Working dir exists.');
    });

}

// Setup server
var app = express();
app.use(bodyParser.json({limit: '50mb'}));

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

    if (err.code === 'EACCES') {
        logger.error('Seems like we don\'t have write permissions here. ');
    }

    console.error('Caught err: ', err);
    logger.error({
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
module.exports = app;

