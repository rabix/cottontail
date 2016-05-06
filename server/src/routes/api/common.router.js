'use strict';
const commonController = require('./../../controllers/common/common.controller');

module.exports = [
    {
        method: 'GET',
        path: '/common/config',
        config : {
            handler: function(request, reply) {
                commonController.getConfig(request, reply);
            }
        }
    }
];
