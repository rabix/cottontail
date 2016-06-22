'use strict'
const fs = require('fs');

module.exports = {
    validateWorkingDir: (pathArgument) => {
        if (typeof pathArgument === "undefined") {
            throw new Error('No path argument. You must set the workspace path as an argument.');
        }

        let path = pathArgument.trim();
        if (path === '') {
            throw new Error('No path argument. You must set the workspace path as an argument.');
        }

        let stats = fs.lstatSync(path);
        if (!stats.isDirectory()) {
            throw new Error('Directory: "' + path + '" not found.');
        }
    },

    isValidUrl: (url) => {
        var pattern = new RegExp('^((http|https):\\/\\/)'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,})' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

        return pattern.test(url);
    }
};