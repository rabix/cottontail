'use strict';

const commonController = require('./../controllers/common/common.controller');

module.exports = function() {
    return [
        {
            method: 'GET',
            path: '/common/config',
            config : {
                handler: commonController.getConfig
            }
        }
    ];
}();
