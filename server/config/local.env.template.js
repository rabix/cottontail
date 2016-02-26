'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {

    DOMAIN: <DOMAIN>,
    NODE_ENV: <NODE_ENV>,
    WORKING_DIR: <WORKING_DIR>,

    GITHUB_ID: <GITHUB_ID>,
    GITHUB_SECRET: <GITHUB_SECRET>,
    GITHUB_SCOPE: <GITHUB_SCOPE>,

    STRATEGY: <STRATEGY>,
    // Control debug level for modules using visionmedia/debug
    DEBUG_LEVEL: <DEBUG_LEVEL>,
    DEBUG: <DEBUG>
};
