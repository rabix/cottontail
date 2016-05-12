'use strict';
const config = require('./../config/environment');
const path = require('path');

let env = config.env;
let postSizeLimit =  10 * 1024 * 1024; // 10MB in bytes
let appPath;

if ('production' === env) {
    // appPath = path.join(config.root, 'client/dist');
}

if ('development' === env || 'test' === env) {
   // appPath = path.join(config.root, 'client/.tmp/serve');
}

module.exports = [
    /*TODO: Use this if we decide to serve the web app files 
    {
       
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                lookupCompressed: true,
                redirectToSlash: true,
                path: [
                    appPath,
                    path.join(config.root, 'client/src')
                ],
                index: true
            }
        }
    },
    */
    {
        method: 'GET',
        path: '/bower_components/{path*}',
        handler: {
            directory: {
                path: path.join(config.root, 'client/bower_components')
            }
        }
    },
    {
        method: 'POST',
        path: '/{path*}',
        handler: function (request, reply) {
            reply();
        },
        config: {
            cors: {
                origin: ['*'],
                headers: ['Access-Control-Allow-Headers', 'Access-Control-Allow-Methods']
            },
            payload: {
                parse: true,
                maxBytes: postSizeLimit
            }
        }
    }
];