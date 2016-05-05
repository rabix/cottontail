'use strict';

var path = require('path');
var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));


var _confPath = '../local.env';
var _conf = {};
try {
    _conf = require(_confPath);
} catch (e) {
}

var rootPath = path.normalize(__dirname + '/../../../..');

// All configurations will extend these options
// ============================================


let config = {
    env: argv['env'] || process.env.NODE_ENV || 'development',

    // cottontail instance strategy
    strategy: argv['strategy'] || process.env.STRATEGY || 'local',

    debug: argv['debug'] || process.env.DEBUG || true,

    // Root path of server
    root: rootPath,

    // Server port
    port: argv['port'] || process.env.PORT || 9000,

    // Server IP
    host: argv['host'] || process.env.HOST || '127.0.0.1',

    logging: {
        path: rootPath + '/logs'
    },
    openBrowser:  argv['o'] || false,

    store: {
        path: argv._[0] || process.env.WORKING_DIR || process.cwd()
    },
    secrets: {
        session: 'cottontail-secret-must-be-at-least-32-characters'
    },
    reportErrors: argv['error-reporting'] !== undefined ? argv['error-reporting'] : true
};

module.exports = config;
