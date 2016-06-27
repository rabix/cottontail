'use strict';

let CwlService = require('../../services/cwl/cwl.service');
let ErrorService = require('../../services/errors/errors.service');

/**
 * GET request to /cwl/file
 * @param request
 * @param reply
 */
exports.getFile = (request, reply) => {
    let file = request.query.file;

    //TODO(mate): test this
    CwlService.getParsedCwlFile(file).subscribe((res) => {}, (err) => {
        console.log(err)
    }, (completeCwlFile) => {
        return reply({
            message: 'File parsed successfully',
            content: completeCwlFile
        });
    });
};

