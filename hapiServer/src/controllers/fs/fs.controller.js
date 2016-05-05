'use strict';

const Boom = require('boom');
var Store = require('../../services/store');

exports.getFile = (request, reply) => {
    var file = request.params.file;
    
    Store.getFile(file).then(function (data) {
        return reply({
            content: data
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

exports.getCWLToolbox = (request, reply) => {
    Store.getCWLToolbox().then(function(tools) {
        return reply({
            tools: tools
        });
    }).catch(function(err) {
        handleError(reply, err);
    })
};

exports.getFilesInWorkspace = (request, reply) => {
    Store.getFiles().then(function (storeResult) {
        return reply({
            baseDir: storeResult.baseDir,
            paths: storeResult.files
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

exports.updateFile = (request, reply) => {
    var file = request.params.file;

    Store.writeFile(file, request.body.content).then(function (file) {

        return reply({
            message: 'File updated successfully.',
            content: file
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

exports.createFile = (request, reply) => {
    var file = request.params.file;

    Store.createFile(file).then(function (file) {

        return request({
            message: 'File created successfully.',
            content: file
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

function handleError(reply, err) {
    return reply(Boom.wrap(error, err.status));
    //return res.status(err.status || 500).json({error: err});
}
