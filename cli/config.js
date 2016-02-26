/**
 * Created by filip on 8/26/15.
 */
var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');

var configDir = './server/config/';
var configTemplate = configDir + 'local.env.template.js';
var configFile = configDir + 'local.env.js';
var exec = require('child_process').exec;


/**
 * Whenever config gets changed we need to rebuild Frontend to take affect
 *
 * @param callback
 * @private
 */
var _postConfigPhase = function (callback) {

    console.log(chalk.green('Running frontend build to apply config changes...'));
    process.chdir(__dirname + '/../client');

    var child = exec('gulp build');

    //child.stdout.on('data', function(data) {
    //    //console.error(data);
    //    // do nothing we wont cluter user stdout with fe build
    //});
    //
    child.stderr.on('data', function(data) {
        console.error('Error During frontend build: ', data);
    });

    child.on('close', function() {
        console.log('Applied config change to frontend.');

        if (typeof callback === 'function') {
            callback();
        }

    });

};

/**
 * Create config from config template
 *
 * @param conf {object} Object representing configuration
 * @param root {string} Base path to root of cottontail
 * @param callback {function} Callback to be executed when config is created
 */
var create = function (conf, root, callback) {

    fs.readFile(path.normalize(root + configTemplate), 'utf8', function(err, data) {

        if (err) {
            return console.error('Failed to read config template.', err);
        }
        
        // Set default values if missing
        conf['NODE_ENV'] = conf['NODE_ENV'] || 'production';
        conf['WORKING_DIR'] = conf['WORKING_DIR'] || '/data/cottontail/fs/';
        conf['GITHUB_ID'] = conf['GITHUB_ID'] || '';
        conf['GITHUB_SECRET'] = conf['GITHUB_SECRET'] || '';
        conf['GITHUB_SCOPE'] = conf['GITHUB_SCOPE'] || '';
        conf['STRATEGY'] = conf['STRATEGY'] || 'local';
        conf['DEBUG_LEVEL'] = conf['DEBUG_LEVEL'] || '';
        conf['DEBUG'] = typeof conf['DEBUG'] === 'undefined' ? 'true' : conf['DEBUG'].toString();
        conf['PORT'] = conf['NODE_ENV'] === 'production' ? '8080' : '9000';

        // Do the replace
        data = data.replace(/<NODE_ENV>/g, "'" + conf['NODE_ENV'] + "'");
        data = data.replace(/<PORT>/g, "'" + conf['PORT'] + "'");
        data = data.replace(/<WORKING_DIR>/g, "'" + conf['WORKING_DIR'] + "'");
        data = data.replace(/<GITHUB_ID>/g, "'" + conf['GITHUB_ID'] + "'");
        data = data.replace(/<GITHUB_SECRET>/g, "'" + conf['GITHUB_SECRET'] + "'");
        data = data.replace(/<GITHUB_SCOPE>/g, "'" + conf['GITHUB_SCOPE'] + "'");
        data = data.replace(/<STRATEGY>/g, "'" + conf['STRATEGY'] + "'");
        data = data.replace(/<DEBUG_LEVEL>/g, "'" + conf['DEBUG_LEVEL'] + "'");
        data = data.replace(/<DEBUG>/g, conf['DEBUG']);

        fs.writeFile(root + configFile, data, 'utf8', function(err) {
            if (err) return console.log('Failed to write config file.', err);

            _postConfigPhase(callback);
        });

    });
};

var _readJSON = function (filePath, callback) {
    fs.readFile(path.normalize(filePath), function (err, data) {

        if (err) {
            throw err;
        }


        if (typeof callback === 'function') {
            var _json = JSON.parse(data.toString());
            callback(_json);
        }
    })
};

var fromFile = function (filePath, root, callback) {

    console.log('Got config file: ', chalk.magenta.italic(filePath));

    fs.stat(path.normalize(filePath), function (err) {

        if (err)  {
            console.error('Failed reading of config file: ', filePath, err);
            process.exit(1);
        }

        var ext = path.extname(filePath);

        if (ext !== '.js' && ext !== '.json') {
            console.error('Config file must have extension "js" or "json"');
            process.exit(1);
        }

        switch (ext) {
            case '.js':
                fs.copySync(path.normalize(filePath),  path.normalize(root + configFile));
                _postConfigPhase(callback);
                break;
            case '.json':
                _readJSON(filePath, function (data) {
                    create(data, root, callback)
                });
                break;
        }

    });

};

module.exports = {
    create: create,
    fromFile: fromFile
};
