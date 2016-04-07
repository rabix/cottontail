'use strict';

var express = require('express');
var router = express.Router();
var logger = require('../../components/logger');

router.post('/', function(req, res, next){
    logger.error('Client side error', req.body);

    return res.json();
});

module.exports = router;