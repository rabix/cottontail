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
            handler: fsController.getFilesInWorkspace
        }
    },

    /**
     * Toolbox
     */
    {
        method: 'GET',
        path: '/fs/toolbox',
        config : {
            handler: fsController.getCWLToolbox
        }
    },

    /**
     * Files
     */
    {
        method: 'GET',
        path: '/fs/{file}',
        config : {
            handler: fsController.getFile
        }
    },
    {
        method: 'POST',
        path: '/fs/{file}',
        config : {
            handler: fsController.createFile
        }
    },
    {
        method: 'PUT',
        path: '/fs/{file}',
        config : {
            handler: fsController.updateFile
        }
    }
];
