const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy   = require("passport-jwt").Strategy;
const Validator = require("validator");
const UserModel = require("../model/user-model");
require("dotenv").config();

// handle user registration
passport.use("signup", new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    if (Validator.isEmail(email)) {
      if (Validator.isLength(password, {min:6, max:20})) {
        const { name } = req.body;
        if (Validator.isLength(name, {min:3, max:20} ) && Validator.isAlphanumeric(name)) {
          const user = await UserModel.create({ email, password, name});
          return done(null, user);
        }
        else {
          done(new Error("This is not a correct username, only letters and numbers, min 3 max 20"));
        }
      }
      else {
        done(new Error("This is not a correct password, minimum 6 length, max 20"));
      }
    }
    else {
      done(new Error("This is not a correct mail adresss"));
    }
  }
  catch (error) {
    done(error);
  }
}));

// handle user login
passport.use("login", new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const validate = await user.isValidPassword(password);
      if (validate) {
        return done(null, user, { message: "Logged in Successfully" });
      }
      else {
        return done(null, false, { message: "Wrong Password" });
      }
    }
    else {
      return done(null, false, { message: "User not found" });
    }
  }
  catch (error) {
    return done(error);
  }
}));

// verify token is valid
passport.use(new JwtStrategy({
  secretOrKey: process.env.PUBLIC_KEY,
  jwtFromRequest: function (req) {
    return (req && req.cookies) ? req.cookies["jwt"] : null;
  }
}, async (token, done) => {
  try {
    return done(null, token.user);
  }
  catch (error) {
    done(error);
  }
}));
