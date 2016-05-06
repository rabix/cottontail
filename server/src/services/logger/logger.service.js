'use strict';
let winston = require('winston');
let winstonGraylog2 = require('winston-graylog2');
let path = require('path');
let config = require('../../config/environment');

let logPath = path.normalize(config.logging.path);

let debugLog = logPath + '/cottontail.log';
let exceptionLog = logPath + '/cottontail-error.log';

let timeFormatFn = function () {
    return Date.now();
};

let winstonTransports = [
    new (winston.transports.DailyRotateFile)({
        filename: debugLog,
        dirname: config.logging.path,
        timestamp: timeFormatFn
    }),
    new winston.transports.File({filename: debugLog, json: false})
];

if (config.reportErrors) {
    winstonTransports.push(new (winstonGraylog2)({
        name: 'cottontail-graylog',
        level: 'error',
        silent: false,
        handleExceptions: true,
        processMeta: function (meta) {
            meta.cli_args = process.argv;
            meta.node_Version = process.version;
            meta.platform = process.platform;

            return meta;
        },
        graylog: {
            servers: [{host: 'rabix.org', port: 12201}],
            facility: 'Cottontail',
            bufferSize: 1400,
            hostname: 'cottontail-remote-server'
        }
    }));
}

let logger = new (winston.Logger)({
    transports: winstonTransports,
    exceptionHandlers: [
        new (winston.transports.DailyRotateFile)({
            filename: exceptionLog,
            dirname: config.logging.path,
            timestamp: timeFormatFn
        }),
        new (winston.transports.Console)({json: false, timestamp: true})
    ],
    exitOnError: false
});

if (config.debug) {
    logger.add(winston.transports.Console, {
        json: false,
        timestamp: true,
        prettyPrint: true,
        colorize: true
    });
}

module.exports = logger;