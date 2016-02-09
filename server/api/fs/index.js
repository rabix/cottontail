'use strict';

var express = require('express');
var controller = require('./fs.controller');

var router = express.Router();
//var auth = require('../../auth/auth.service');

router.get('/', controller.index);

/**
 * Workspace
 */
router.get('/:workspace', controller.getFilesInWorkspace);
router.post('/:workspace', controller.createWorkspace);

/**
 * Files
 */
router.get('/:workspace/:file', controller.getFile);
router.post('/:workspace/:file', controller.createFile);
router.put('/:workspace/:file', controller.updateFile);

module.exports = router;