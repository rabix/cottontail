var path = require('path');

var postSizeLimit =  10 * 1024 * 1024; // 10MB in bytes

module.exports = [
    {
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                lookupCompressed: true,
                redirectToSlash: true,
                path: [
                    path.join(__dirname, '../../../client/.tmp/serve'),
                    path.join(__dirname, '../../../client/src')
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
                path: path.join(__dirname, '../../../client/bower_components')
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