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
            handler: function(request, reply) {
                fsController.getFilesInWorkspace(request, reply);
            }
        }
    },

    /**
     * Toolbox
     */
    {
        method: 'GET',
        path: '/fs/toolbox',
        config : {
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
        path: '/fs/{file}',
        config : {
            handler: function(request, reply) {
                fsController.getFile(request, reply);
            }
        }
    },
    {
        method: 'POST',
        path: '/fs/{file}',
        config : {
            handler: function(request, reply) {
                fsController.createFile(request, reply);
            }
        }
    },
    {
        method: 'PUT',
        path: '/fs/{file}',
        config : {
            handler: function(request, reply) {
                fsController.updateFile(request, reply);
            }
        }
    }
];
