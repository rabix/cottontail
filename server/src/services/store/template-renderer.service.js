"use strict";
const FS = require("fs");
const Q = require("q");
const Handlebars = require("handlebars");

const templateDir = __dirname + "/templates";

/**
 * Renders the template with given ID and applies given params as template variables
 * @param {string} templateName
 * @param {Object} params
 * @returns {Promise<string>}
 */
exports.render = (templateName, params) => {
    templateName = templateName.replace(/_/g, "-");

    const filename = `${templateDir}/${templateName}.hbs`;
    const deferred = Q.defer();

    FS.access(filename, FS.F_OK, fileDoesntExist => {
        if (fileDoesntExist) {
            return deferred.reject("Template doesn't exist.");
        }

        FS.readFile(filename, "UTF-8", (err, content) => {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(Handlebars.compile(content)(params));
        });

    });


    return deferred.promise;
};
