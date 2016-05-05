var config = require('./../config/environment');
var path = require('path');

var env = config.env;
var postSizeLimit =  10 * 1024 * 1024; // 10MB in bytes
var appPath;

if ('production' === env) {
    appPath = path.join(config.root, 'client/dist');
}

if ('development' === env || 'test' === env) {
    appPath = path.join(config.root, 'client/.tmp/serve');
}

module.exports = [
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
            payload: {
                parse: true,
                maxBytes: postSizeLimit
            }
        }
    }
];