const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: String,
  email: String,
  picture: String,
  password: String,
});

module.exports.UserModel = model('UserModel', UserSchema);
