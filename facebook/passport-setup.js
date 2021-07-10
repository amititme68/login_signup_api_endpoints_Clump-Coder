const passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
      done(null, user);
});


// Enter your client id and client secret below
passport.use(new facebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID,
    clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/facebook/callback",
    profileFields: ['id','displayName','name','gender','picture.type(large)','email']
  },
  function(token,refreshToken, profile, done) {
     // console.log(profile);
      return done(null, profile);
  }
));