'use strict';
const fsController = require('./../../controllers/fs/fs.controller');

module.exports = [
    /**
     * Workspace
     */
    {
        method: 'GET',
        path: '/fs',
        config : {
            plugins: {
                'hapi-io': 'getFilesInWorkspace'
            },
            handler: function(request, reply) {
                fsController.getFilesInWorkspace(request, reply);
            }
        }
    },

    /**
     * Directory
     */
    {
        method: 'GET',
        path: '/fs/dir',
        config: {
            plugins: {
                'hapi-io': 'getDirContents'
            },
            handler: function(request, response) {
                fsController.getDirContents(request, response);
            }
        }

    },

    /**
     * Toolbox
     * @deprecated
     */
    {
        method: 'GET',
        path: '/fs/toolbox',
        config : {
            plugins: {
                'hapi-io': 'getCWLToolbox'
            },
            handler: function(request, reply) {
                fsController.getCWLToolbox(request, reply);
            }
        }
    },

    /**
     * Files
     */
    {
        method: 'GET',
        path: '/fs/file',
        config : {
            plugins: {
                'hapi-io': 'getFile'
            },
            handler: function(request, reply) {
                fsController.getFile(request, reply);
            }
        }
    },
    {
        method: 'POST',
        path: '/fs/{file}',
        config : {
            plugins: {
                'hapi-io': 'createFile'
            },
            handler: function(request, reply) {
                fsController.createFile(request, reply);
            }
        }
    },
    {
        method: 'PUT',
        path: '/fs/{file}',
        config : {
            plugins: {
                'hapi-io': 'updateFile'
            },
            handler: function(request, reply) {
                fsController.updateFile(request, reply);
            }
        }
    }
];
