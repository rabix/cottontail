/**
 * Error responses
 */

'use strict';
var logger = require('../logger');

module.exports = {
    handle: function (err) {
        if (err.code === 'EACCES') {
            logger.error('Seems like we don\'t have write permissions here. ', err);
        } else {
            logger.error('Error occured: ', err);
        }
    }
};


