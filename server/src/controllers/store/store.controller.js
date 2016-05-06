'use strict';
const helper = require('../../services/store/store.service');
const config = require('../../config/environment');
const path = require('path');
// have to do this because path.isAbsoulte is feature not support in all envs of node
const pathIsAbsolute = require('path-is-absolute');
let dir = config.store.path;
dir = path.resolve(dir);


console.log('Store dir', dir);

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

    getDir: () => {
        return helper.readDir(dir);
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