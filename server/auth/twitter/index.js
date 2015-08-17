'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
    .get('/', passport.authenticate('twitter', {
        failureRedirect: '/signup',
        session: false
    }))

    .get('/callback', passport.authenticate('twitter', {
        failureRedirect: '/signup',
        session: false
    }), function (rea, res, next) {
        auth.postLogin(req, res, next);
        auth.setTokenCookie(req, res, next);
    });

module.exports = router;