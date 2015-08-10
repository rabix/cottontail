var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

exports.setup = function (User, config) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    passport.use(new GithubStrategy({
            clientID: config.github.clientID,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackURL,
            scope: config.github.scope
        },
        function (accessToken, refreshToken, profile, done) {

            User.findOne({
                    'github.id': profile.id
                },
                function (err, user) {

                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            role: 'user',
                            username: profile.username,
                            provider: 'github',
                            github: profile._json
                        });
                        user.save(function (err) {
                            if (err) return done(err);
                            done(err, user);
                        });
                    } else {
                        return done(err, user);
                    }
                })
        }
    ));
};
