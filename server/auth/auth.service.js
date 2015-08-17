'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var Store = require('../components/store');
var Logger = require('../components/logger');
var validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function (req, res, next) {

            if (config.strategy === 'local') {
                next();
            } else {
                // allow access_token to be passed through query parameter as well
                if (req.query && req.query.hasOwnProperty('access_token')) {
                    req.headers.authorization = 'Bearer ' + req.query.access_token;
                }

                validateJwt(req, res, next);

            }
        })
        // Attach user to request
        .use(function (req, res, next) {

            if (config.strategy === 'local') {

                req.user = {
                    provider: 'local',
                    name: 'local'
                };

                next();
            } else {
                User.findById(req.user._id, function (err, user) {
                    if (err) return next(err);
                    if (!user) return res.status(401).json({message: 'Unauthorized'});

                    req.user = user;
                    next();
                });

            }
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            }
            else {
                res.status(403).json({message: 'Forbidden'});
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    return jwt.sign({_id: id}, config.secrets.session, {expiresInMinutes: 3600 * 5});
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
    if (!req.user) return res.status(500).json({message: 'Something went wrong, please try again.'});
    var token = signToken(req.user._id, req.user.role);
    res.cookie('token', JSON.stringify(token));
    res.redirect('/');
}


var getUser = function (user) {

    if (user.provider === 'local') {
        return user.name;
    }

    return user[user.provider].login + '/';
};

function postLogin(req) {
    var dir = config.store.path;

    if (dir.charAt(dir.length - 1) !== '/') {
        dir = dir + '/';
    }

    Store.fs.mkdir(dir + getUser(req.user)).then(function () {
        Logger.info('User dir created.');
    }, function () {
        Logger.info('User dir already set.');
    });

}

exports.postLogin = postLogin;
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;