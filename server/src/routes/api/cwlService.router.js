'use strict';
const cwlController = require('./../../controllers/cwl/cwl.controller');

module.exports = [
    /**
     * Parse a cwl file to a Cwl Object Model
     */
    {
        method: 'GET',
        path: '/cwl/file',
        config: {
            plugins: {
                'hapi-io': 'getParsedCwlFile'
            },
            handler: function(request, response) {
                cwlController.getParsedCwlFile(request, response);
            }
        }
    }
];
