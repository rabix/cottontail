/**
 * Created by filip on 3/2/16.
 */
var ConfigFile = require('../../config/local.env');
var _ = require('lodash');

function filterConfig(conf) {
    var config = _.clone(conf, true);
    var forbidden = ['GITHUB*', 'SESSION_SECRET', 'GOOGLE*', 'TWITTER*',  'FACEBOOK*'];

    _.forEach(config, function (val, key) {

        // TODO: fix find not optimal
        var find = _.find(forbidden, function (v) {
            var pattern = new RegExp(v , 'ig');
            return pattern.test(key);
        });

        if (find) {
            config[key] = null;
            delete config[key];
        }
    });

    return config;
}

exports.getConfig = function (req, res) {
    return res.json(filterConfig(ConfigFile));
};

