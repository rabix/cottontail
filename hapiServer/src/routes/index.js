'use strict';

const commonRoutes = require('./common.router');
const fileService = require('./filseService.router');

let routes = [].concat(commonRoutes, fileService);

exports.register = function (server, options, next) {
    
    /* Get controller routes */
    for (var route in routes) {
        server.route(routes[route]);
    }
    next();

};

exports.register.attributes = {
    name: 'router',
    version: '0.0.0'
};