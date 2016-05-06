'use strict';

const commonRoutes = require('./common.router');
const fileService = require('./filseService.router');

//let routes = [].concat(commonRoutes, fileService);

exports.register = function (server, options, next) {

    server.route(commonRoutes);
    server.route(fileService);
    
   /* /!* Get controller routes *!/
    for (var route in routes) {
        server.route(routes[route]);
    }
    next();*/

};

exports.register.attributes = {
    name: 'apiRouter',
    version: '0.0.0'
};