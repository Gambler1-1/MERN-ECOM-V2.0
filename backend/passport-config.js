var passport = require("passport");
const bcrypt = require("bcryptjs");
const flash = require("express-flash");
const User = require("./models/user");
const jwt = require('jsonwebtoken')
let userObj = {};

var LocalStrategy = require("passport-local").Strategy;

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log("No User with this Email");

      return done(null, false, { errorMessage: "no user with this email" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log("password matched");
      const token = jwt.sign(email, process.env.JWT_SECRET);
      user._doc.token = token;
      userObj = { ...user };
      return done(null, user);
    } else {
      // console.log("password not matched");

      return (
        done(null, false), flash("error", "You Entered incorrect Password.")
      );
    }
  } catch (error) {
    done(error);
  }
};
const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser(function (userObj, done) {
  done(null, userObj);
});
passport.deserializeUser(function (userObj, done) {
  User.findById(userObj._id, function (err, user) {
    done(err, userObj);
  });
});
