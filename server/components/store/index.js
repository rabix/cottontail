/**
 * Created by filip on 8/14/15.
 */
var helper = require('./helper');
var config = require('../../config/environment');
var path = require('path');
var dir = config.store.path;
dir = path.resolve(dir);

module.exports = {
    fs: helper,

    getFile: function (file) {
        file = path.isAbsolute(file) ? file : path.resolve(dir, file);
        return helper.readFile(file);
    },

    getFiles: function () {
        return helper.readWorkspace(dir);
    },

    getDir: function () {
        return helper.readDir(dir);
    },

    createWorkspace: function (name) {
        return helper.mkdir(dir + name);
    },

    createFile: function (file) {
        file = path.isAbsolute(file) ? file : path.resolve(dir, file);
        return helper.createFile(file);
    },

    writeFile: function (file, content) {
        file = path.isAbsolute(file) ? file : path.resolve(dir, file);
        return helper.overwrite(file, content);
    }
};