const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const User = require("../models/User");

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/google/cobalt",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        passReqToCallback   : true
      },
      function(request, accessToken, refreshToken, profile, done) {
          console.log(profile)
        User.findOne({ googleId: profile.id }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    provider: 'google',
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
