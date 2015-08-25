#! /usr/bin/env node
/**
 * Created by filip on 8/25/15.
 */
"use strict";

var _ = require('lodash');
var minimist = require('minimist');
var spawn = require('./spawn');
var prompt = require('./prompt');

var args = minimist(process.argv.slice(2));
var confPath = _.find(args, function (value, arg) {
    return arg === 'c' || arg === 'config';
});

if (args['node-interpreter']) {
    process.env.NODE_INTERPRETER = args['node-interpreter'];
}

if (args['base-dir']) {
    process.env.BASE_DIR = args['base-dir'];
}

prompt([
    {
        type: 'input',
        name: 'test',
        message: 'how are you?'
    }
], function (ans) {
    console.log(ans);
    spawn.start();
});


