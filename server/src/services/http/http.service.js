'use strict';
const Wreck = require('wreck');
const q = require('q');

module.exports = {
    getRequest: function(url) {
        let deferred = q.defer();

        Wreck.request("get", url, null, function(err, res) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            }

            /*
             The response is a Buffer stream which
             with need to read and turn into a json */
            Wreck.read(res, null, function (err, body) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                }

                let parsedBody = '';
                try {
                    parsedBody = JSON.parse(body.toString());
                } catch(err) {
                    console.log("Response can't be parsed to JSON " + err);
                    deferred.reject("Response can't be parsed to JSON " + err);
                }

                deferred.resolve(parsedBody);
            });
        });

        return deferred.promise;
    }
};
