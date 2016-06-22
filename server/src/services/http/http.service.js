'use strict';
const Wreck = require('wreck');

module.exports = {
    getRequest: function(url) {
        return Wreck.request("GET", url, null, (err, res) => {
            if (err) {
                throw err;
            }

            /* TODO: see if there is a cleaner way for this
            The response is a Buffer stream which
            with need to read and turn into a json */
            Wreck.read(res, null, function (err, body) {
                if (err) {
                    throw err;
                }
                return JSON.parse(body.toString());
            });
        });
    }
};