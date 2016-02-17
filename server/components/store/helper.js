/**
 * Created by filip on 8/14/15.
 */

var fs = require('fs');
var yaml = require('yaml-js');
var json2yaml = require('json2yaml');
var path = require('path');
var q = require('q');
var mkdirp = require('mkdirp');
var dir = require('node-dir');
var Error = require('../errors');

module.exports = {

    checkExsits: function (path) {
        var deferred = q.defer();

        if (typeof path === 'string' ) {
            fs.exists(path, function (exists) {

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

    readFile: function (dirPath) {
        var deferred = q.defer();

        this.checkExsits(dirPath)
            .then(function () {
                fs.readFile(dirPath, "utf-8", function (err, file) {

                    if(err) {
                        Error.handle(err);
                        deferred.reject(err);
                    }

                    var extension = path.extname(dirPath);
                    if(extension === '.yaml') {

                        var yamlFile = yaml.load(file);
                        var jsonString = JSON.stringify(yamlFile, null, 4);
                        deferred.resolve(jsonString);
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
                        return deferred.reject(err);
                    }

                    files = files.map(function(file) {
                        return {
                            type: path.extname(file),
                            name: path.basename(file)
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

    createFile: function (fileName, content) {
        var deferred = q.defer();

        if (fileName) {

            fs.writeFile(fileName, content || '', function(err) {
                if(err) {
                    Error.handle(err);
                    deferred.reject(err);
                }

                deferred.resolve({
                    name: fileName,
                    type: path.extname(fileName),
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

                var extension = path.extname(fileName);
                if(extension === '.yaml') {
                    var yamlText = json2yaml.stringify(JSON.parse(content));
                    return _self.createFile(fileName, yamlText);
                }

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