const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const rimraf = require('rimraf');

const User = require('../database/models/user.model');

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => {

  res.sendStatus(200);
});

router.post('/register', (req, res) => {
  if (!req.isAuthenticated()) { return res.sendStatus(403); }

  // create user
  if (req.user.role !== 'ADMIN') {
    return res.sendStatus(403);
  }

  bcrypt.hash(req.body.password, +process.env.SALT_ROUNDS)
    .then((hash) => {
      const user = new User({
        username: req.body.username,
        password: hash,
        role: 'USER'
      });

      user.save((err, element) => {
        if (err) { return res.sendStatus(400); }

        return res.status(201).json(element);
      });
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    })
});

router.delete('/register', (req, res) => {
  if (!req.isAuthenticated()) { return res.sendStatus(403); }

  if (req.user.role !== 'ADMIN') { return res.sendStatus(403); }

  User.deleteOne({ ObjectId: req.body.userId }, function (err) {
    if (err) { return res.sendStatus(500); }

    rimraf(`${process.env.ROOT}/uploads/${req.body.userId}`, function (err) {
      if (err) { return res.sendStatus(500); }

      return res.sendStatus(200);
    });
  })
});

module.exports = router;
