/**
 * Created by filip on 3/2/16.
 */
'use strict';

var express = require('express');
var controller = require('./common.controller');

var router = express.Router();

/**
 * Get Config
 */
router.get('/config', controller.getConfig);

module.exports = router;