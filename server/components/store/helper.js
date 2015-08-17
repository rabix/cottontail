/**
 * Created by filip on 8/14/15.
 */

var fs = require('fs');
var path = require('path');
var Q = require('Q');
var mkdirp = require('mkdirp');
var dir = require('node-dir');

module.exports = {

    checkExsits: function (path) {
        var deferred = Q.defer();

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

    readFile: function (path) {
        var deferred = Q.defer();

        this.checkExsits(path)
            .then(function () {
                fs.readFile(path, function (err, file) {

                    if(err) {
                        console.log(err);
                        deferred.reject(err);
                    }

                    deferred.resolve(file.toString());
                });
            })
            .catch(function (err) {
                deferred.reject(err)
            });

        return deferred.promise;
    },

    readWorkspace: function (path) {
        var deferred = Q.defer();

        this.checkExsits(path)
            .then(function () {
                dir.files(path, function(err, files) {
                    if (err) return deferred.reject(err);

                    deferred.resolve(files);
                });
            })
            .catch(function (err) {
                deferred.reject(err)
            });

        return deferred.promise;

    },

    readDir: function (path) {
        var deferred = Q.defer();

        this.checkExsits(path)
            .then(function () {
                fs.readdir(path, function(err, files) {
                    if (err) return deferred.reject(err);

                    deferred.resolve(files);
                });
            })
            .catch(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    },

    mkdir: function (path) {
        var deferred = Q.defer();

        if (typeof path === 'string' ) {

            this.checkExsits(path)
                .then(function () {
                    deferred.reject('Workspace already exists.');
                }, function () {
                    
                    //doesnt exist
                    mkdirp(path, function (err) {
                        if (err) {
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
        var deferred = Q.defer();

        if (fileName) {

            fs.writeFile(fileName, content || '', function(err) {
                if(err) {
                    console.log(err);
                    deferred.reject(err);
                }

                deferred.resolve(true);
            });

        }

        return deferred.promise;
    },

    truncate: function (fileName) {
        var deferred = Q.defer();

        fs.truncate(fileName, 0, function(err){

            if(err) {
                console.log(err);
                deferred.reject(err);
            }

            deferred.resolve(true);
        });

        return deferred.promise;
    },

    overwrite: function (fileName, content) {
        var deferred = Q.defer();
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