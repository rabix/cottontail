'use strict';

const commonRoutes = require('../routes/api/common.router');
const fileService = require('../routes/api/fileService.router');
const cwlService = require('../routes/api/cwlService.router');

exports.register = function (server, options, next) {
    server.route(commonRoutes);
    server.route(fileService);
    server.route(cwlService);

    next();
};

exports.register.attributes = {
    name: 'apiRouter',
    version: '0.0.0'
};