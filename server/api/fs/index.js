'use strict';

var express = require('express');
var controller = require('./fs.controller');

var router = express.Router();
var auth = require('../../auth/auth.service');

router.get('/', auth.isAuthenticated(), controller.index);

/**
 * Workspace
 */
router.get('/:workspace', auth.isAuthenticated(), controller.getFilesInWorkspace);
router.post('/:workspace', auth.isAuthenticated(), controller.createWorkspace);

/**
 * Files
 */
router.get('/:workspace/:file', auth.isAuthenticated(), controller.getFile);
router.post('/:workspace/:file', auth.isAuthenticated(), controller.createFile);
router.put('/:workspace/:file', auth.isAuthenticated(), controller.updateFile);


module.exports = router;