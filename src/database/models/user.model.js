const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: String,
});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then((result) => {
      return result;
    })
    .catch((result) => {
      return result;
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
