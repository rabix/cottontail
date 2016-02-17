/**
 * Created by filip on 8/14/15.
 */
var helper = require('./helper');
var config = require('../../config/environment');
var dir = config.store.path;
var Q = require('q');

if (dir.charAt(dir.length - 1) !== '/') {
    dir = dir + '/';
}

module.exports = {
    fs: helper,

    getFile: function (file) {
        return helper.readFile(dir + '/' + file);
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
        return helper.createFile(dir + '/' + file);
    },

    writeFile: function (file, content) {
        return helper.overwrite(dir + '/' + file, content);
    }
};