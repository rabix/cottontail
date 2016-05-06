'use strict';
const config = require('../../config/environment');

exports.getConfig = (request, reply) => {
    return reply(config);
};