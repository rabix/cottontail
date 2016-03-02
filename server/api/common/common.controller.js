/**
 * Created by filip on 3/2/16.
 */
var ConfigFile = require('../../config/local.env');
var _ = require('lodash');

exports.getConfig = function (req, res) {
    return res.json(_.omit(ConfigFile, ['GITHUB_ID', 'GITHUB_SECRET', 'GITHUB_SCOPE']));
};

