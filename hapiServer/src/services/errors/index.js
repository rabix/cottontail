/**
 * Error responses
 */

'use strict';
var logger = require('../logger');

module.exports = {
    '404': function pageNotFound(req, res) {
        var viewFilePath = '404';
        var statusCode = 404;
        var result = {
            status: statusCode
        };

        res.status(result.status);
        //res.render(viewFilePath, function (err) {
        //    if (err) {
        //        return res.json(result, result.status);
        //    }
        //
        //    res.render(viewFilePath);
        //});

        res.json({message: 'Not found.'})
    },
    handle: function (err) {
        if (err.code === 'EACCES') {
            logger.error('Seems like we don\'t have write permissions here. ', err);
        } else {
            logger.error('Error occured: ', err);
        }
    }
};


