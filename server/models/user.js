const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const salt = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  }
});

// UserSchema.pre('save', next => {
//   console.log(this.], 'Password');
//   this.password = bcrypt.hashSync(this.password, salt);
//   next();
// });

module.exports = mongoose.model('user', UserSchema);
