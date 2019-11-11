var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSize = new Schema({
  type: {
    type: String,
    required: 'Kindly enter the Type name for the size you are creating'
  },
  values: {
    type: String,
    required: "please enter values in comma separated pattern"
  }
})

module.exports = mongoose.model('size', ProductSize);