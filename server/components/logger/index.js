/**
 * Created by filip on 7.8.15..
 */

'use strict';

var winston = require('winston');
var path = require('path');
var config = require('../../config/environment');

var logPath = path.normalize(config.logging.path);

var debugLog = logPath + '/cottontail.log';
var exceptionLog = logPath + '/cottontail-error.log';

var timeFormatFn = function () {
    return Date.now();
};

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            filename: debugLog,
            dirname: config.logging.path,
            timestamp: timeFormatFn
        }),
        new winston.transports.File({ filename: debugLog, json: false })
    ],
    exceptionHandlers: [
        new (winston.transports.DailyRotateFile)({
            filename: exceptionLog,
            dirname: config.logging.path,
            timestamp: timeFormatFn
        }),
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: exceptionLog, json: false })
    ],
    exitOnError: false
});

if (config.env && config.env !== 'production') {
    logger.add(winston.transports.Console, {
        json: false,
        timestamp: true,
        prettyPrint: true,
        colorize: true
    });
}

module.exports = logger;