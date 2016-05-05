/**
 * Yo. Here's the deal with the try-catch block.
 * We are packaging the whole Cottontail (alongside all dependencies) into a tarball so we can distribute it.
 * Users won't need to install external packages and modules.
 * This also means that NPM will not check their NodeJS runtime engine version, and unexpected errors might happen.
 *
 * Important: in order to be able to catch errors, please try to keep the usage of ES6 and more recent NodeJS features
 * out of this file. This is the entry point of the app,
 * and if it results in a presumed syntax error, we won't be able to catch it.
 */

require('babel-register');
try {
    'use strict';

    var Hapi = require('hapi');
    
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    var validationComponent = require('./src/services/validation');

    /* The path argument needs to be set before the environment config is loaded */
    if (typeof process.argv[2] !== 'undefined') {
        var pathArgument = process.argv[2];
        validationComponent.validateWorkingDir(pathArgument);
        process.env.WORKING_DIR = pathArgument;
        console.log('WORKING_DIR is ' + process.env.WORKING_DIR);
    }

    var Store = require('./src/services/store');
    var config = require('./src/config/environment');
    var logger = require('./src/services/logger');

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


    /**
     * Create a server with a host and port */
    var oneMB = 1048576;
    var postSizeLimit =  10 * oneMB;

    var server = new Hapi.Server();

    server.connection({
        host: config.host,
        port: config.port
    });


    var goodOptions = {
        reporters: [{
            reporter: require('good-console'),
            events: { log: ['request'], response: '*' }

        }]
    };

    /**
     *  Register the router as a plugin so we can prefix the routes */
    server.register([
        {
            register: require('./src/routes'),
            routes: {
                prefix: '/api'
            }
        }, {
            /* Static file handler */
            register: require('inert')
        },
        {
            /* HTTP proxy */
            register: require('h2o2')
        },
        {
            /* Session */
            register: require('yar'),
            options: {
                storeBlank: true,
                cookieOptions: {
                    password: config.secrets.session,
                    isSecure: true
                }
            }
        },
        {
            register: require('good'),
            options: goodOptions
        }
    ], function(err) {
        if (err) {
            console.log('Failed loading the plugin: ' + err);
        }
    });

    server.route([
        {
            method: 'GET',
            path: '/{path*}',
            handler : {
                directory: {
                    path: [
                        '../client/.tmp/serve',
                        '../client/src'
                    ],
                    index: true
                }
            }
        },
        {
            method: 'GET',
            path: '/bower_components/{path*}',
            handler : {
                directory: {
                    path: '../client/bower_components'
                }
            }
        },
        {
            method: 'POST',
            path: '/{path*}',
            handler: function(request, reply) {
                reply();
            },
            config: {
                payload: {
                    parse: true,
                    maxBytes: postSizeLimit
                }
            }
        }
    ]);

    /*server.ext('onRequest', function (request, reply) {

        // Change all requests to '/test'
        //request.setUrl('/test');
        var response = request.response;

        if (response.header) {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
            response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            return reply.continue();
        }
    });*/


    server.ext('onPreResponse', function (request, reply) {
        var response = request.response;

        if (response.header) {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
            response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            //THIS WORKS reply(response);

            reply.continue();
        }

        /**
         * All errors are intercepted here and formated
         */
        if (response.isBoom) {
            console.error('Caught err: ', response.message);
            logger.error({
                route: request.path,
                status: response.output.statusCode || 500,
                message: response.message || 'Request parse error'
            });

            reply.continue();
            //reply({error: response.message});
                /*.code(response.output.statusCode || 500)
                .type('application/json');*/

        }
    });


    /**
     *  Start the server */
    server.start(function(err) {
        if (err) {
            throw err;
        }

        var address = 'http://' + config.host + ':' + config.port;
        if (config.openBrowser) {
            require('open')(address);
        }

        console.log('Express server listening on %s, in %s mode', address, config.env);
    });

} catch (exception) {
    // Assuming that we wouldn't commit a syntax error,
    // it's most likely the result of a NodeJS version being lower than 4
    if (exception.name === 'SyntaxError') {

        // v4 is when the ES6 came in, 4.2 is the LTS
        var versionRequirement = [4, 2, 0];

        var versionIsSatisfied = process.version.slice(1).split('.').reduce(function (prev, current, i) {
            return prev === true && ~~current >= versionRequirement[i];
        }, true);

        if (!versionIsSatisfied) {
            console.warn('Hey there.\nWe have encountered an error that\'s most likely ' +
                'caused by an outdated NodeJS version (%s).' +
                '\nPlease consider updating to at least v%s.\n\nThanks,\nThe Rabix Team',
                process.version,
                versionRequirement.join('.'));
        } else {
            throw exception;
        }

    } else {
        throw exception;
    }
} 
