/**
 * Created by filip on 8/26/15.
 */
var fs = require('fs');

var create = function (conf, root, callback) {
    var configDir = root + '/server/config/';
    var configTemplate = configDir + 'local.env.template.js';
    var configFile = configDir + 'local.env.js';

    fs.readFile(configTemplate, 'utf8', function(err, data) {
        if (err) {
            return console.error('Failed to read config template.', err);
        }
        
        console.log(conf['DEBUG_LEVEL']);
        conf['NODE_ENV'] = conf['NODE_ENV'] || 'development';
        conf['GITHUB_ID'] = conf['GITHUB_ID'] || '';
        conf['GITHUB_SECRET'] = conf['GITHUB_SECRET'] || '';
        conf['GITHUB_SCOPE'] = conf['GITHUB_SCOPE'] || '';
        conf['STRATEGY'] = conf['STRATEGY'] || 'local';
        conf['DEBUG_LEVEL'] = conf['DEBUG_LEVEL'] || '';
        conf['DEBUG'] = typeof conf['DEBUG'] === 'undefined' ? 'true' : conf['DEBUG'].toString();


        data = data.replace(/<NODE_ENV>/g, "'" + conf['NODE_ENV'] + "'");
        data = data.replace(/<GITHUB_ID>/g, "'" + conf['GITHUB_ID'] + "'");
        data = data.replace(/<GITHUB_SECRET>/g, "'" + conf['GITHUB_SECRET'] + "'");
        data = data.replace(/<GITHUB_SCOPE>/g, "'" + conf['GITHUB_SCOPE'] + "'");
        data = data.replace(/<STRATEGY>/g, "'" + conf['STRATEGY'] + "'");
        data = data.replace(/<DEBUG_LEVEL>/g, "'" + conf['DEBUG_LEVEL'] + "'");
        data = data.replace(/<DEBUG>/g, conf['DEBUG']);

        fs.writeFile(configFile, data, 'utf8', function(err) {
            if (err) return console.log('Failed to write config file.', err);

            if (typeof callback === 'function') {
                callback();
            }
        });

    });
};

module.exports = {
    create: create
};
