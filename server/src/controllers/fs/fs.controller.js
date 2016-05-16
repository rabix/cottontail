'use strict';
let Boom = require('boom');
let Store = require('../../controllers/store/store.controller');

/*
@todo: ensure documents and directories outside of working dir cannot be accessed
@todo: error handling for nonexistent directories/contents
 */

exports.getFile = (request, reply) => {
    let file = request.query.file;

    if (!file) {
        return handleError(reply, {status: 400, message: 'File path not specified'});
    }
    
    Store.getFile(file).then((data) => {
        return reply({
            content: data
        });
    }).catch(function (err) {
        return handleError(reply, err);
    });
};

/**
 * @deprecated
 * @param request
 * @param reply
 */
exports.getCWLToolbox = (request, reply) => {
    Store.getCWLToolbox().then((tools) => {
        return reply({
            tools: tools
        });
    }).catch(function(err) {
        return handleError(reply, err);
    });
};

exports.getDirContents = (request, reply) => {
    let dir = request.query.dir;
    
    Store.getDir(dir).then((content) => {
        console.log(" Dir content", content);
        return reply({
            content: content
        });
    }).catch(function(err){
        return handleError(reply, err);
    });
};

/**
 * @deprecated
 * @param request
 * @param reply
 */
exports.getFilesInWorkspace = (request, reply) => {
    Store.getFiles().then((storeResult) => {
        return reply({
            baseDir: storeResult.baseDir,
            paths: storeResult.files
        });
    }).catch(function (err) {
        return handleError(reply, err);
    });
};

exports.updateFile = (request, reply) => {
    let file = request.query.file;

    if (!file) {
        return handleError(reply, {status: 400, message: 'File path not specified'});
    }

    Store.writeFile(file, request.payload.content).then((file) => {

        return reply({
            message: 'File updated successfully.',
            content: file
        });
    }).catch(function (err) {
        return handleError(reply, err);
    });
};

exports.createFile = (request, reply) => {
    let file = request.query.file;

    if (!file) {
        return handleError(reply, {status: 400, message: 'File path not specified'});
    }


    Store.createFile(file).then((file) => {

        return reply({
            message: 'File created successfully.',
            content: file
        });
    }).catch(function (err) {
        return handleError(reply, err);
    });
};

function handleError(reply, err) {

    let wrapped = Boom.create(err.status, err.message);
    return reply(wrapped);
}
