const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const Validator = require('validator');
const UserModel = require('../models/userModel');

// handle user registration
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    if(Validator.isEmail(email)){
      if(Validator.isLength(password, {min:6, max:20})){
        const { name } = req.body;
        if(Validator.isLength(name, {min:3, max:20} ) && Validator.isAlphanumeric(name)){
          const user = await UserModel.create({ email, password, name});
          return done(null, user);
        }
        else{
          done(new Error("This is not a correct username, only letters and numbers, min 3 max 20"));
        }
      }
      else{
        done(new Error("This is not a correct password, minimum 6 length, max 20"));
      }
    }
    else{
      done(new Error("This is not a correct mail adresss"));
    }

  } catch (error) {
    done(error);
  }
}));

// handle user login
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      return done(null, false, { message: 'Wrong Password' });
    }
    return done(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    return done(error);
  }
}));

// verify token is valid
passport.use(new JWTstrategy({
  secretOrKey: 'top_secret',
  jwtFromRequest: function (req) {
    let token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
  }
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));