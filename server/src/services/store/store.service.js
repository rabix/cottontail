'use strict';
const fs = require('fs');
const yaml = require('yaml-js');
const json2yaml = require('json2yaml');
const path = require('path');
const q = require('q');
const mkdirp = require('mkdirp');
const dir = require('node-dir');
const Error = require('../errors/errors.service');
const readline = require('readline');
const async = require('async');

const config = require('../../config/environment');
let workingDir = config.store.path;

/*
 @todo: ensure documents and directories outside of working dir cannot be accessed
 might be useful for this task: https://docs.nodejitsu.com/articles/file-system/security/introduction/

 @todo: error handling for nonexistent/inaccessible directories/files
 */


/**
 * Helper function that formats file object
 * @param file
 * @returns {{name, type, path}}
 */
function makeBaseFile(file) {
    return {
        name: path.basename(file),
        type: path.extname(file),
        // so the frontend always has relative path to working directory
        relativePath: path.relative(path.resolve(workingDir), file),
        absolutePath: path.resolve(workingDir, file)
    };
}


function parseDirContents(file) {

    let deferred = q.defer();
    let template = {
        name: path.basename(file),
        // so the frontend always has relative path to working directory
        relativePath: path.relative(path.resolve(workingDir), file),
        absolutePath: path.resolve(workingDir, file)
    };

    //@FIXME handle error better
    fs.lstat(file, (err, stats) => {
        if (err) {
            console.error(err);
            deferred.resolve(null);
        }
        if (stats.isDirectory()) {
            template.type = 'directory';

            //@FIXME handle error better
            fs.readdir(file, (err, files) => {
                if (!err) {
                    template.isEmpty = (!files && !files.length);
                    deferred.resolve(template);
                }
            })

        } else {
            template.type = path.extname(file);
            deferred.resolve(template);
        }
    });


    return deferred.promise;

}

module.exports = {

    checkExsits: function(filePath) {
        let deferred = q.defer();

        if (typeof filePath === 'string') {
            filePath = path.isAbsolute(filePath) ? filePath : path.resolve(workingDir, filePath);

            fs.exists(filePath, function(exists) {

                return exists ? deferred.resolve(exists) : deferred.reject({
                    message: 'File doesn\'t exist.',
                    status: 404
                });
            });
        } else {
            deferred.reject({
                message: 'Path name must be a string',
                status: 400
            });
        }

        return deferred.promise;
    },

    readFile: function(filePath) {
        let deferred = q.defer();

        if (!filePath) {
            deferred.reject({
                status: 400,
                message: 'File path not specified'
            });
        }

        filePath = path.isAbsolute(filePath) ? filePath : path.resolve(workingDir, filePath);

        this.checkExsits(filePath)
            .then(function() {
                fs.readFile(filePath, "utf-8", function(err, file) {
                    
                    if (err) {
                        Error.handle(err);
                        deferred.reject(err);
                    }

                    let baseFile = makeBaseFile(filePath);
                    baseFile.content = file;

                    if (baseFile.type === '.yaml') {

                        let yamlFile = yaml.load(file);
                        let jsonString = '';

                        if (yamlFile !== null) {
                            jsonString = JSON.stringify(yamlFile, null, 4);
                        }

                        baseFile.content = jsonString;
                        deferred.resolve(baseFile);
                    }

                    deferred.resolve(baseFile);
                });
            })
            .catch(function(err) {
                deferred.reject(err)
            });

        return deferred.promise;
    },

    readWorkspace: function(dirPath) {
        let deferred = q.defer();

        this.checkExsits(dirPath)
            .then(function() {
                dir.files(dirPath, function(err, files) {
                    if (err) {
                        Error.handle(err);
                        return deferred.reject(reason);
                    }

                    files = files.map(function(file) {

                        return makeBaseFile(file);
                    });

                    deferred.resolve({
                        baseDir: dirPath,
                        files: files
                    });
                });
            })
            .catch(function(err) {
                deferred.reject(err)
            });

        return deferred.promise;

    },

    readDir: function(relativePath) {
        let deferred = q.defer();
        relativePath = relativePath || '';

        let resolvedPath = path.resolve(workingDir, relativePath);

        this.checkExsits(resolvedPath)
            .then(function() {
                fs.readdir(resolvedPath, function(err, contents) {
                    if (err) {
                        Error.handle(err);
                        return deferred.reject(err);
                    }

                    let promises = contents.map((filePath) => {
                        return parseDirContents(path.resolve(resolvedPath, filePath));
                    });

                    q.all(promises).then((content) => {
                        deferred.resolve(content);
                    }, (err) => {
                        deferred.reject(err);
                    });
                });
            })
            .catch(function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    },

    readCWLFiles: function(dirPath) {
        let deferred = q.defer();

        this.checkExsits(dirPath)
            .then(function() {
                dir.files(dirPath, function(err, files) {

                    if (err) {
                        Error.handle(err);
                        return deferred.reject(err);
                    }

                    async.map(files, function(file, callback) {

                        if (path.extname(file) !== '.json') {
                            return callback(null, null);
                        }

                        let lineReader = readline.createInterface({
                            input: fs.createReadStream(file)
                        });

                        let found = false;

                        lineReader.on('line', function(line) {
                            let baseFile;

                            if (/^(\s{0,4}|\t?)("class": "Workflow")/.test(line)) {
                                found = true;
                                baseFile = makeBaseFile(file);
                                baseFile.class = 'Workflow';
                                return callback(null, baseFile);

                            } else if (/^(\s{0,4}|\t?)("class": "CommandLineTool")/.test(line)) {
                                found = true;
                                baseFile = makeBaseFile(file);
                                baseFile.class = 'CommandLineTool';
                                return callback(null, baseFile);
                            }
                        });

                        lineReader.on('close', function() {
                            if (!found) {
                                return callback(null, null);
                            }
                        });

                    }, function(err, results) {

                        if (err) {
                            Error.handle(err);
                            deferred.reject(err);
                        }

                        let filteredResults = results.filter(function(file) {
                            return file !== null;
                        });

                        deferred.resolve(filteredResults);
                    });
                });
            });

        return deferred.promise;
    },

    mkdir: function(path) {
        let deferred = q.defer();

        if (typeof path === 'string') {

            this.checkExsits(path)
                .then(function() {
                    deferred.reject('Workspace already exists.');
                }, function() {

                    //doesnt exist
                    mkdirp(path, function(err) {
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

    _writeFile: function(filePath, content) {
        let deferred = q.defer();

        fs.writeFile(filePath, content || '', function(err) {
            if (err) {
                Error.handle(err);
                deferred.reject(err);
            }

            let baseFile = makeBaseFile(filePath);
            baseFile.content = content || '';

            deferred.resolve(baseFile);
        });

        return deferred.promise;
    },

    createFile: function(filePath, content) {
        let deferred = q.defer();
        let _self = this;

        if (!filePath) {
            deferred.reject({
                status: 400,
                message: 'File path not specified'
            });
        }

        filePath = path.isAbsolute(filePath) ? filePath : path.resolve(workingDir, filePath);

        fs.access(filePath, fs.F_OK, function(err) {
            if (err) {
                _self._writeFile(filePath, content).then(function (success) {
                    deferred.resolve(success);
                }, function(err) {
                    deferred.reject(err);
                })

            } else {
                deferred.reject({
                    message: 'Cannot overwrite existing file',
                    status: 403
                });
            }
        });

        return deferred.promise;
    },

    truncate: function(fileName) {
        let deferred = q.defer();

        fs.truncate(fileName, 0, function(err) {

            if (err) {
                deferred.reject(err);
            }

            deferred.resolve(true);
        });

        return deferred.promise;
    },

    overwrite: function(fileName, content) {
        let deferred = q.defer();
        let _self = this;

        if (!fileName) {
            deferred.reject({
                status: 400,
                message: 'File path not specified'
            });
        }

        fileName = path.isAbsolute(fileName) ? fileName : path.resolve(workingDir, fileName);

        this.truncate(fileName)
            .then(function() {
                let extension = path.extname(fileName);
                if (extension === '.yaml') {
                    let yamlText = json2yaml.stringify(JSON.parse(content));
                    return _self._writeFile(fileName, yamlText);
                }

                return _self._writeFile(fileName, content);
            })
            .then(function() {
                deferred.resolve(true);
            })
            .catch(function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

};