const express = require('express');

const User = require('../database/models/user.model');
const Photo = require('../database/models/photo.model');

const router = express.Router();

router.route('/selection')
  .get((req, res) => {
    if (!req.isAuthenticated()) { return res.sendStatus(403); }

    if (req.user.role === 'USER' && req.body.submit) {
      User.updateOne({ ObjectId: req.user.ObjectId, submitted: false }, { submitted: true }, function (err) {
        if (err) { return res.sendStatus(403); }

        Photo.updateMany({ ObjectId: { $in: req.body.userIds } }, { selected: true }, function (err) {
          if (err) { return res.sendStatus(400); }

          return res.sendStatus(200);
        })
      })
    }
  });

module.exports = router;
