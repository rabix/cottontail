'use strict';
let config = require('../../config/environment');

exports.getConfig = function(request, reply) {
    return reply(config);
};