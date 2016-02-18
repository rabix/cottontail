'use strict';

var express = require('express');
var controller = require('./fs.controller');

var router = express.Router();

/**
 * Workspace
 */
router.get('/', controller.getFilesInWorkspace);
router.post('/', controller.createWorkspace);

/**
 * Files
 */
router.get('/:file', controller.getFile);
router.post('/:file', controller.createFile);
router.put('/:file', controller.updateFile);

module.exports = router;