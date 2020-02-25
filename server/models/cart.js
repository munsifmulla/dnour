var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Cart = new Schema({
  product: {
    type: ObjectId,
    required: 'Please select a product.',
    ref: 'product'
  },
  qty: {
    type: Number,
    required: 'Kindly select the qty.'
  },
  size: {
    type: String,
    required: "Kindly select a size."
  },
  color: {
    type: String,
    required: 'Kindly select the color'
  },
  user_id: {
    type: String,
    required: 'Kindly upload the thumb image of the category'
  },
});

module.exports = mongoose.model('cart', Cart);