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

    getFile: function (workspace, file) {
        return this.fs.readFile(dir + workspace + '/' + file);
    },

    getFiles: function (workspace) {
        return this.fs.readWorkspace(dir + workspace);
    },

    getWorkspaces: function (path) {
        return this.fs.readDir(dir + path);
    },

    createWorkspace: function (name) {
        return this.fs.mkdir(dir + name);
    },

    createFile: function (workspace, file, content) {
        return this.fs.createFile(dir + workspace + '/' + file);
    },

    writeFile: function (workspace, file, content) {
        this.fs.overwrite(dir + workspace + '/' + file, content);
    }
};