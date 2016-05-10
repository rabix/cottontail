'use strict';
const Boom = require('boom');
const Store = require('../../controllers/store/store.controller');

exports.getFile = (request, reply) => {
    let file = request.params.file;
    
    Store.getFile(file).then((data) => {
        return reply({
            content: data
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

exports.getCWLToolbox = (request, reply) => {
    Store.getCWLToolbox().then((tools) => {
        return reply({
            tools: tools
        });
    }).catch(function(err) {
        handleError(reply, err);
    })
};

exports.getDirContents = (request, response) => {

    Store.getDir(request.query.dir).then((contents) => {
        console.log(contents);
        return response({
            contents: contents
        });
    }).catch((err) => {
        handleError(response, err);
    });
};

exports.getFilesInWorkspace = (request, reply) => {
    Store.getFiles().then((storeResult) => {
        return reply({
            baseDir: storeResult.baseDir,
            paths: storeResult.files
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

exports.updateFile = (request, reply) => {
    let file = request.params.file;

    Store.writeFile(file, request.payload.content).then((file) => {

        return reply({
            message: 'File updated successfully.',
            content: file
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

exports.createFile = (request, reply) => {
    let file = request.params.file;

    Store.createFile(file).then((file) => {

        return reply({
            message: 'File created successfully.',
            content: file
        });
    }).catch(function (err) {
        handleError(reply, err);
    });
};

function handleError(reply, err) {
    return reply(Boom.wrap(error, err.status));
}
