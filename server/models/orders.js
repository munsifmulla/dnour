var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Orders = new Schema({
  products: {
    type: Schema.Types.Mixed,
    required: 'Please select a product.'
  },
  address: {
    type: ObjectId,
    required: "Address is required",
    ref: 'user_address'
  },
  payment_method: {
    type: String,
    required: 'Payment method is required',
  },
  order_value: {
    type: Number
  },
  order_placed_date: {
    type: String
  },
  order_payment_status: {
    type: String
  },
  order_status: {
    type: String
  },
});

module.exports = mongoose.model('orders', Orders);