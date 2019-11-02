var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CreateLog = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the log'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the log'
  },
  code: {
    type: String,
    required: 'Add your code'
  },
  tags: {
    type: String,
    required: 'Add your tags'
  }
})

module.exports = mongoose.model('logs', CreateLog);