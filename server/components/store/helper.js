/**
 * Created by filip on 8/14/15.
 */

var fs = require('fs');
var path = require('path');
var q = require('q');
var mkdirp = require('mkdirp');
var dir = require('node-dir');
var Error = require('../errors');

var config = require('../../config/environment');
var workingDir = config.store.path;

module.exports = {

    checkExsits: function (filePath) {
        var deferred = q.defer();

        if (typeof filePath === 'string' ) {
            fs.exists(filePath, function (exists) {

                return exists ? deferred.resolve(exists) : deferred.reject({
                    message: 'File doesn\'t exist.',
                    status: 404
                });
            });
        } else {
            deferred.reject('Path name must be a string');
        }

        return deferred.promise;
    },

    readFile: function (path) {
        var deferred = q.defer();

        this.checkExsits(path)
            .then(function () {
                fs.readFile(path, "utf-8", function (err, file) {

                    if(err) {
                        Error.handle(err);
                        deferred.reject(err);
                    }

                    deferred.resolve(file);
                });
            })
            .catch(function (err) {
                deferred.reject(err)
            });

        return deferred.promise;
    },

    readWorkspace: function (dirPath) {
        var deferred = q.defer();

        this.checkExsits(dirPath)
            .then(function () {
                dir.files(dirPath, function(err, files) {
                    if (err) {
                        Error.handle(err);
                        return deferred.reject(reason);
                    }

                    files = files.map(function(file) {

                        return {
                            name: path.basename(file),
                            type: path.extname(file),
                            // so the frontend always has relative path to working directory
                            path: path.relative(path.resolve(workingDir), file)
                        }
                    });

                    deferred.resolve(files);
                });
            })
            .catch(function (err) {
                deferred.reject(err)
            });

        return deferred.promise;

    },

    readDir: function (path) {
        var deferred = q.defer();

        this.checkExsits(path)
            .then(function () {
                fs.readdir(path, function(err, files) {
                    if (err) {
                        Error.handle(err);
                        return deferred.reject(err);
                    }

                    deferred.resolve(files);
                });
            })
            .catch(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    },

    mkdir: function (path) {
        var deferred = q.defer();

        if (typeof path === 'string' ) {

            this.checkExsits(path)
                .then(function () {
                    deferred.reject('Workspace already exists.');
                }, function () {
                    
                    //doesnt exist
                    mkdirp(path, function (err) {
                        if (err) {
                            Error.handle(err);

                            deferred.reject(err)
                        }

                        deferred.resolve(true);
                    });

                })


        } else {
            deferred.reject('Dir name must be a string');
        }

        return deferred.promise;
    },

    createFile: function (filePath, content) {
        var deferred = q.defer();

        if (filePath) {

            fs.writeFile(filePath, content || '', function(err) {
                if(err) {
                    Error.handle(err);
                    deferred.reject(err);
                }

                deferred.resolve({
                    name: path.basename(filePath),
                    type: path.extname(filePath),
                    path: path.relative(path.resolve(workingDir), filePath),
                    content: content || ''
                });
            });

        }

        return deferred.promise;
    },

    truncate: function (fileName) {
        var deferred = q.defer();

        fs.truncate(fileName, 0, function(err){

            if(err) {
                Error.handle(err);
                deferred.reject(err);
            }

            deferred.resolve(true);
        });

        return deferred.promise;
    },

    overwrite: function (fileName, content) {
        var deferred = q.defer();
        var _self = this;

        this.truncate(fileName)
            .then(function () {
                return _self.createFile(fileName, content);
            })
            .then(function () {
                deferred.resolve(true)
            })
            .catch(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

};