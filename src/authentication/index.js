const passport = require('passport');
require('./strategies/local.strategy');

const User = require('../database/models/user.model');

const setupAuthentication = (app) => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = {
  setupAuthentication,
};
