const express = require('express');

const bodyParser = require('body-parser');
const multer  = require('multer');
const fs = require('fs');

const Photo = require('../database/models/photo.model');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    fs.mkdir(`${process.env.ROOT}/uploads/${req.body.userId}`, function (err) {
      cb(null, `uploads/${req.body.userId}/`);
    })
  },
  filename: function (req, file, cb) {
    const parts = file.originalname.split('.');
    const extension = parts[parts.length - 1];
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
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
      url: req.file.path,
      userId: req.body.userId,
      selected: false,
    });

    photo.save({}, (err, item) => {
      if (err) { return res.sendStatus(400); }

      return res.status(201).json(item);
    });
  });

module.exports = router;
