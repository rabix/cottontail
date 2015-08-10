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
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var winston = require('../components/logger');

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


    app.use(passport.initialize());

    // Persist sessions with mongoStore
    // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
    app.use(session({
        secret: config.secrets.session,
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
            mongooseConnection: mongoose.connection,
            db: 'cottontail'
        })
    }));

    if ('production' === env) {
        app.use(favicon(path.join(config.root, config.clientPath, 'favicon.ico')));
        app.use(express.static(path.join(config.root, config.clientPath)));
        app.set('appPath', path.join(config.root, config.clientPath));
        app.use(morgan('dev'));
    }

    if ('development' === env || 'test' === env) {
        app.use(require('connect-livereload')());

        app.use(express.static(path.join(config.root, 'client/.tmp/serve')));
        app.use(express.static(path.join(config.root, 'client/src')));

        app.use('/bower_components', express.static(path.join(config.root, 'client/bower_components')));

        app.set('appPath', path.join(config.root, 'client'));
    }



    app.use(morgan({
        format: 'dev',
        'stream': {
            write: function (str) {
                winston.info(str);
            }
        }
    }));

};