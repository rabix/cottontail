/**
 * Created by filip on 8/26/15.
 */
var fs = require('fs');
var configDir = '../server/config/';
var configTemplate = configDir + 'local.env.template.js';
var configFile = configDir + 'local.env.js';

fs.readFile(configTemplate, 'utf8', function(err, data) {
    if (err) {
        return console.error('Failed to create config file');
    }

    data = data.replace(/<node_env>/g, 'development');
    data = data.replace(/<GITHUB_ID>/g, 'development');
    data = data.replace(/<GITHUB_SECRET>/g, 'development');
    data = data.replace(/<GITHUB_SCOPE>/g, 'development');
    data = data.replace(/<STRATEGY>/g, 'development');
    data = data.replace(/<DEBUG_LEVEL>/g, 'development');
    data = data.replace(/<DEBUG>/g, 'development');

    fs.writeFile('config.js', result, 'utf8', function(err) {
        if (err) return console.log(err);
    });
});
