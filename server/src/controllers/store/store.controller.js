/**
 * Created by filip on 8/14/15.
 */
var helper = require('../../services/store/store.service');
var config = require('../../config/environment');
var path = require('path');
// have to do this because path.isAbsoulte is feature not support in all envs of node
var pathIsAbsolute = require('path-is-absolute');
var dir = config.store.path;
dir = path.resolve(dir);


console.log('Store dir', dir);

module.exports = {
    fs: helper,

    getFile: function (file) {
        file = pathIsAbsolute(file) ? file : path.resolve(dir, file);
        return helper.readFile(file);
    },

    getFiles: function () {
        return helper.readWorkspace(dir);
    },

    getCWLToolbox: function () {
        return helper.readCWLFiles(dir);
    },

    getDir: function () {
        return helper.readDir(dir);
    },

    createWorkspace: function (name) {
        return helper.mkdir(dir + name);
    },

    createFile: function (file) {
        file = pathIsAbsolute(file) ? file : path.resolve(dir, file);
        return helper.createFile(file);
    },

    writeFile: function (file, content) {
        file = pathIsAbsolute(file) ? file : path.resolve(dir, file);
        return helper.overwrite(file, content);
    }
};