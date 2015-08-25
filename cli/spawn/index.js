/**
 * Created by filip on 8/25/15.
 */

var logger = require('../../server/components/logger');
var exec = require('child_process').exec;

module.exports = {

    start: function () {

        if (this.child) {
            logger.error('Server allready running.');
            return false;
        }

        var nodeInterpreter = process.env.NODE_INTERPRETER || 'node';

        process.chdir(__dirname + '/../../server');

        var child = exec(nodeInterpreter + ' app.js');

        child.stdout.on('data', function(data) {
            logger.info(data);
        });

        child.stderr.on('data', function(data) {
            logger.error(data);
        });

        child.on('close', function(code) {
            logger.info('Stopping Cottontail: [Status code] ' + code);
        });

        this.child = child;
    },

    stop: function () {
        if (this.child && typeof this.child.kill === 'function') {
            this.child.kill();
            this.child = null;
        } else {
            logger.warn('There is no child process running.')
        }
    },

    restart: function () {
        this.stop();
        this.start();
    }
};
