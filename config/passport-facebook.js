const FacebookStrategy = require( 'passport-facebook' ).Strategy;

const User = require("../models/User");

module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:5000/facebook/cobalt"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        User.findOne({ facebookId: profile.id }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    firstName: profile.displayName.split(' ')[0],
                    lastName: profile.displayName.split(' ')[1],
                    email: profile.emails[0].value,
                    facebookId: profile.id,
                    provider: 'facebook',
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
      }
    ));

     // runs when user logs in to create session cookie
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
  
    // runs on every request after login to verify user
    passport.deserializeUser(async (id, done) => {
        try {
        const user = await User.findById(id);
        done(null, user);
        } catch (error) {
        done(error);
        }
    });
}