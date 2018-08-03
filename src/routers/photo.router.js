const express = require('express');

const multer  = require('multer');

const Photo = require('../database/models/photo.model');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/${req.user.objectId}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
const upload = multer({ storage });

const router = express.Router();

router.route('/photos')
  .get((req, res) => {
    if (!req.isAuthenticated()) { return res.sendStatus(403); }

    Photo.find({ userId: req.user.ObjectId })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch(() => {
        return res.sendStatus(400);
      });
  })
  .post(upload.single('photo'), (req, res) => {

    const photo = new Photo({
      url: `uploads/${}`,
      userId: null,
      selected: false,
    });

    return res.sendStatus(201);
  });

module.exports = router;
