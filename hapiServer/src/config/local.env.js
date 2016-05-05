'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
    DOMAIN: 'http://localhost:9000',
    SESSION_SECRET: 'cottontail-secret',
    NODE_ENV: 'development',
    WORKING_DIR: '/Users/mate/testws',

    FACEBOOK_ID: 'app-id',
    FACEBOOK_SECRET: 'secret',

    TWITTER_ID: 'app-id',
    TWITTER_SECRET: 'secret',

    GOOGLE_ID: 'app-id',
    GOOGLE_SECRET: 'secret',

    GITHUB_ID: 'app-id',
    GITHUB_SECRET: 'secret',
    GITHUB_SCOPE: 'user',


    STRATEGY: 'local',
    // Control debug level for modules using visionmedia/debug
    DEBUG_LEVEL: '',
    DEBUG: true
};
