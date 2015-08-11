'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
    .get('/', passport.authenticate('github'))

    .get('/callback', passport.authenticate('github', {
            failureRedirect: '/'
        }), auth.setTokenCookie);

module.exports = router;