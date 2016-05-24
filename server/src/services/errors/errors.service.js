/**
 * Error responses
 */

'use strict';
let logger = require('../logger/logger.service');

module.exports = {
    handle: function (err) {
        if (err.code === 'EACCES') {
            logger.log('Seems like we don\'t have write permissions here. ', err);
        } else {
            logger.log('Error occured: ', err);
        }
    }
};


