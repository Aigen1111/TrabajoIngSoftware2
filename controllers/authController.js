const User = require('../models/User');
const passport = require('passport');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};