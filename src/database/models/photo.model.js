const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  url: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
