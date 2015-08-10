'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
    .get('/', passport.authenticate('github'))

    .get('/callback', passport.authenticate('github', {
            failureRedirect: '/'
        }),
        function (req, res, next) {


            auth.setTokenCookie(req, res, next);
        });

module.exports = router;