/**
 * Error responses
 */

'use strict';
let logger = require('../logger/logger.service');
let Boom = require('boom');

module.exports = {
    handle: function(err) {
        if (err.code === 'EACCES') {
            logger.log('Seems like we don\'t have write permissions here. ', err);
        } else {
            logger.log('Error occured: ', err);
        }
        
        //todo: have a look at logger it doesn't log some errors
        console.dir(err)
    },
    
    handleRequestError: function(err) {
        //TODO
        // return Boom.create(err.errno, err);
    }
};


