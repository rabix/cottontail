var fs = require('fs');

module.exports = {
    validateWorkingDir: function (pathArgument) {
        if (typeof pathArgument === "undefined") {
            throw new Error('No path argument. You must set the workspace path as an argument.');
        }

        var path = pathArgument.trim();
        if (path === '') {
            throw new Error('No path argument. You must set the workspace path as an argument.');
        }

        var stats = fs.lstatSync(path);
        if (!stats.isDirectory()) {
            throw new Error('Directory: "' + path + '" not found.');
        }
    }
};