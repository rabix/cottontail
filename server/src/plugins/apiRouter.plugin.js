'use strict';

const commonRoutes = require('../routes/api/common.router');
const fileService = require('../routes/api/filseService.router');

exports.register = function (server, options, next) {
    server.route(commonRoutes);
    server.route(fileService);

    next();
};

exports.register.attributes = {
    name: 'apiRouter',
    version: '0.0.0'
};