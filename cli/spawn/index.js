/**
 * Created by filip on 8/25/15.
 */

var logger = require('../../server/components/logger');
var exec = require('child_process').exec;

module.exports = {

    start: function () {
        var nodeInterpreter = process.env.NODE_INTERPRETER || 'node';
        var baseDir = '../server/';
        
        if (process.env.BASE_DIR) {
            process.chdir(process.env.BASE_DIR);
            baseDir = '';
        }
        
        var child = exec(nodeInterpreter + ' ' + baseDir + 'app.js');

        child.stdout.on('data', function(data) {
            logger.info(data);
        });

        child.stderr.on('data', function(data) {
            logger.error(data);
        });

        child.on('close', function(code) {
            logger.info('Stopping Cottontail: ' + code);
        });

        this.child = child;
    },

    stop: function () {
        if (this.child && typeof this.child.kill === 'function') {
            this.child.kill();
        } else {
            logger.warn('There is no child process running.')
        }
    }
};
