'use strict';
let config = require('../../config/environment/index');

exports.getConfig = function (req, res) {
    return res.json(config);
};
