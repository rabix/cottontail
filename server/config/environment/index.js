'use strict';

var path = require('path');
var _ = require('lodash');
var minimist = require('minimist');

// dont nees first two args since they are node and app.js
var args = minimist(process.argv.slice(2));
var configFile = _.find(args, function (value, arg) {
    return arg === 'c' || arg === 'config';
});

var _confPath = configFile || '../local.env';
var _conf = require(_confPath) || {};

_.extend(process.env, _conf);

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // cottontail instance strategy
    strategy: process.env.STRATEGY || 'git',

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    logging: {
        path: '/data/log/cottontail'
    },

    store: {
        path: process.env.STORE_PATH || '/data/cottontail/fs/'
    },

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'cottontail-secret'
    },

    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
    },

    twitter: {
        clientID: process.env.TWITTER_ID || 'id',
        clientSecret: process.env.TWITTER_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
    },

    google: {
        clientID: process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
    },

    github: {
        clientID: process.env.GITHUB_ID || 'id',
        clientSecret: process.env.GITHUB_SECRET || 'secret',
        callbackURL: (process.env.DOMAIN || '') + '/auth/github/callback',
        scope: process.env.GUTHUB_SCOPE || ''
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
