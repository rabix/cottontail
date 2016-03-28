/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var session = require('express-session');
var winston = require('../components/logger');

/**
 * Default express session configuration
 * @type {{secret: string, resave: boolean, saveUninitialized: boolean}}
 */
var sessionConfig = {
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true
};

module.exports = function (app) {
    var env = app.get('env');

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(function (req, res, next) {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        next();
    });

    app.use(session(sessionConfig));

    if ('production' === env) {
        // served by gulp
        app.use(express.static(path.join(config.root, 'client/dist')));
        // the source root
        app.use(express.static(path.join(config.root, 'client/src')));
        // bower components
        app.use('/bower_components', express.static(path.join(config.root, 'client/bower_components')));
        app.set('appPath', path.join(config.root, 'client'));
    }

    if ('development' === env || 'test' === env) {
        app.use(require('connect-livereload')());

        // served by gulp
        app.use(express.static(path.join(config.root, 'client/.tmp/serve')));
        // the source root
        app.use(express.static(path.join(config.root, 'client/src')));
        // bower components
        app.use('/bower_components', express.static(path.join(config.root, 'client/bower_components')));
        app.set('appPath', path.join(config.root, 'client'));
    }


    // Logs requests to stdout
    app.use(morgan({
        format: 'dev',
        stream: {
            write: function (str) {
                winston.info(str);
            }
        }
    }));

};