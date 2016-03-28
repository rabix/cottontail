var ConfigFile = require('../../config/local.env');

exports.getConfig = function (req, res) {
    return res.json(ConfigFile);
};
