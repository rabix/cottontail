'use strict';
let config = require('../../config/environment');

exports.getConfig = (request, reply) => {
    return reply(config);
};