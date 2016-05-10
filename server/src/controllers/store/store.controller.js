'use strict';
const helper = require('../../services/store/store.service');
const config = require('../../config/environment');
const path = require('path');
// have to do this because path.isAbsoulte is feature not support in all envs of node
// @TODO remove this absurd import, it's like one line of code
const pathIsAbsolute = require('path-is-absolute');
let dir = config.store.path;
dir = path.resolve(dir);


console.log('Store dir', dir);


//@TODO: simplify this interface, it's an unnecessary duplicate

module.exports = {
    fs: helper,

    getFile: (file) => {
        file = pathIsAbsolute(file) ? file : path.resolve(dir, file);
        return helper.readFile(file);
    },

    getFiles: () => {
        return helper.readWorkspace(dir);
    },

    getCWLToolbox: () => {
        return helper.readCWLFiles(dir);
    },

    getDir: (path) => {
        return helper.readDir(path);
    },

    createWorkspace: (name) => {
        return helper.mkdir(dir + name);
    },

    createFile: (file) => {
        file = pathIsAbsolute(file) ? file : path.resolve(dir, file);
        return helper.createFile(file);
    },

    writeFile: (file, content) => {
        file = pathIsAbsolute(file) ? file : path.resolve(dir, file);
        return helper.overwrite(file, content);
    }
};