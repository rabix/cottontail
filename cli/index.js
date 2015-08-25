#! /usr/bin/env node
/**
 * Created by filip on 8/25/15.
 */
"use strict";

var _ = require('lodash');
var path = require('path');
var program = require('commander');
var spawn = require('./spawn');
var prompt = require('./prompt');
var fs = require('fs');
var chalk = require('chalk');

var info = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/../package.json')).toString());

var parseOptions = function (options) {
    //console.log('Options', options);

    process.env.NODE_INTERPRETER = options.nodeInterpreter || 'node';
    process.env.BASE_DIR = options.baseDir || 'node';
    process.env.CONFIG = options.config || false;

    if (options.env) {
        process.env.NODE_ENV = options.env;
    }
    
};

program
    .version(info.version || '0.0.1')
    // Setup
    .command('setup')
    .description('Configure Cottontail.')
    .action(function (options) {
        console.log(chalk.green.italic('Running Cottontail setup.'));
    });

program
    // Run
    .command('run')
    .description('Run Cottontail web app.')
    .action(function (options) {
        parseOptions(options);
        spawn.start();
    });

program
    // Available Options
    .option('-e, --env [env]', 'Specify environment.')
    .option('-c, --config [config]', 'Specify custom config file.')
    .option('-n, --node-interpreter [nodeInterpreter]', 'Specify node interpreter')
    .option('-b, --base-dir [baseDir]', 'Specify base directory when running app');

program.parse(process.argv);

var commands = {
    
    stop: function () {
        console.log(chalk.green.italic('> Stoping server.'));
        spawn.stop();
    },

    start: function () {
        console.log(chalk.green.italic('> Starting server.'));
        spawn.start();
    },

    restart: function () {
        console.log(chalk.green.italic('> Restarting server.'));
        spawn.restart();
    },

    close: function () {
        console.log(chalk.green.italic('> Closing process.'));
    },

    rs: function () {
        return this.restart();
    }
};

process.stdin.on('data', function (data) {
    data = (data + '').trim().toLowerCase();

    if (typeof commands[data] === 'function') {
        commands[data]();
    }
});


