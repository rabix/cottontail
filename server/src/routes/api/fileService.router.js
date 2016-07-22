'use strict';
const fsController = require('./../../controllers/fs/fs.controller');

module.exports = [
    /**
     * Get directory content
     */
    {
        method: 'GET',
        path: '/fs/dir',
        config: {
            plugins: {
                'hapi-io': 'getDirContents'
            },
            handler: function (request, response) {
                fsController.getDirContents(request, response);
            }
        }

    },

    /**
     * Get file content
     */
    {
        method: 'GET',
        path: '/fs/file',
        config: {
            plugins: {
                'hapi-io': 'getFile'
            },
            handler: function (request, reply) {
                fsController.getFile(request, reply);
            }
        }
    },

    /**
     * Create file
     */
    {
        method: 'POST',
        path: '/fs/file/',
        config: {
            plugins: {
                'hapi-io': 'createFile'
            },
            handler: function (request, reply) {
                fsController.createFile(request, reply);
            }
        }
    },
    /**
     * Copy File
     */
    {
        method: 'POST',
        path: '/fs/file',
        config: {
            plugins: {'hapi-io': 'copyFile'},
            handler: (request, reply) => fsController.copyFile(request, reply)
        }
    },

    /**
     * Update file content
     */
    {
        method: 'PUT',
        path: '/fs/file/',
        config: {
            plugins: {
                'hapi-io': 'updateFile'
            },
            handler: function (request, reply) {
                fsController.updateFile(request, reply);
            }
        }
    },

    /**
     * Check if a file or directory exists
     */
    {
        method: 'GET',
        path: '/fs/',
        config: {
            plugins: {
                'hapi-io': 'fileExists'
            },
            handler: function (request, reply) {
                fsController.checkIfFileExists(request, reply);
            }
        }
    }
];
