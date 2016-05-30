'use strict';
let Boom = require('boom');
let StoreService = require('../../services/store/store.service');

/**
 * GET request to fs/file?file={file}
 * @param request
 * @param reply
 */
exports.getFile = (request, reply) => {
    let file = request.query.file;

    StoreService.readFile(file).then((data) => {
        return reply({
            message: 'Read file successfully',
            content: data
        });
    }).catch(function(err) {
        return handleError(reply, err);
    });
};

/**
 * GET request to fs/dir/{dir}
 * @param request
 * @param reply
 */
exports.getDirContents = (request, reply) => {

    StoreService.readDir(request.query.dir).then((content) => {
        return reply({
            message: 'Read directory successfully',
            content: content
        });
    }).catch(function(err) {
        return handleError(reply, err);
    });
};

/**
 * PUT request to fs/file/{file}
 * @param request
 * @param reply
 */
exports.updateFile = (request, reply) => {

    StoreService.overwrite(request.params.file, request.payload.content).then((file) => {
        return reply({
            message: 'File updated successfully.',
            content: file
        });
    }).catch(function(err) {
        return handleError(reply, err);
    });
};

/**
 * POST request to fs/file/{file}
 * @param request
 * @param reply
 */
exports.createFile = (request, reply) => {

    StoreService.createFile(request.params.file, request.params.content).then((file) => {
        return reply({
            message: 'File created successfully.',
            content: file
        });

    }).catch(function(err) {
        return handleError(reply, err);
    });
};

exports.checkIfFileExists = (request, reply) => {
    StoreService.checkExsits(request.query.path).then(result => {
        return reply({
            message: 'File or Directory exists.',
            content: result
        });
    }).catch(function(err) {
        return handleError(reply, err);
    })

};

function handleError(reply, err) {

    let wrapped = Boom.create(err.status, err.message);
    return reply(wrapped);
}
