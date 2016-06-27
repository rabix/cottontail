'use strict';

let CwlService = require('../../services/cwl/cwl.service');
let ErrorService = require('../../services/errors/errors.service');

/**
 * GET request to /cwl/file
 * @param request
 * @param reply
 */
exports.getParsedCwlFile = (request, reply) => {
    let file = request.query.file;

    let completeCwlFile = null;
    CwlService.getParsedCwlFile(file).subscribe((res) => {
        completeCwlFile = res;
    }, (err) => {
        console.log(err)
    }, () => {
        return reply({
            message: 'File parsed successfully',
            content: completeCwlFile
        });
    });
};

