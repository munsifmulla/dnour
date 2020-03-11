var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var ProductDescription = new Schema({
  product_id: {
    type: ObjectId,
    required: 'Add your code'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the log'
  },
  karat_gold: {
    type: String,
    required: 'Kindly enter the karat of the gold',
  },
  weight_gold: {
    type: String,
    required: 'Add gold weight',
  },
  weight_stones: {
    type: String,
    required: 'Add stone weight',
  },
  color_gold: {
    type: String,
    require: 'Add the color for gold',
  },
})

// function getPrice(num) {
//   return (num / 100).toFixed(2);
// }

// function setPrice(num) {
//   return num * 100;
// }

module.exports = mongoose.model('product_description', ProductDescription);