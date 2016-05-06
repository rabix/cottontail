var config = require('./src/config/environment');

var goodOptions = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: ['request'], response: '*' }

    }]
};

module.exports = [
    /**
     *  Register the API router as a plugin so we can have a prefix */
    {
        register: require('./src/plugins/apiRouter.plugin'),
        routes: {
            prefix: '/api'
        }
    }, {
        /* Static file handler */
        register: require('inert')
    },
    {
        /* HTTP proxy */
        register: require('h2o2')
    },
    {
        /* Session */
        register: require('yar'),
        options: {
            storeBlank: true,
            cookieOptions: {
                password: config.secrets.session,
                isSecure: true
            }
        }
    },
    {
        /* Logging */
        register: require('good'),
        options: goodOptions
    }
];