const User = require("./models/user")

const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

 
passport.use(new GoogleStrategy({
    clientID: '972707337948-kum3qkavi8tkfrhjj45uv40ofrok0b3a.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // let user = User.findOne({googleId:profile.id})
    // if(!user){
    //   const newUser = new User({
    //     name: profile.displayName,
    //     googleId: profile.id,
       
    //   });
    //   newUser.save();
    // }
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return cb(null, profile);

  }
));

passport.serializeUser(function(user,done){
    done(null, user)
   })
   passport.deserializeUser(function(user,done){
     done(null, user)
   
   })
   