var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Wishlist = new Schema({
  user_id: {
    type: String,
    required: 'Kindly enter the user ID'
  },
  product_id: {
    type: ObjectId,
    required: 'Kindly enter the product ID'
  },
  product_name: {
    type: String,
    required: 'Kindly enter the name of the product'
  },
  size: {
    type: String,
    required: 'Kindly enter the size of the product'
  },
  quantity: {
    type: Number,
    require: 'Add the qauntity for product',
  },
  price: {
    type: Number,
    required: 'Price is required',
    set: setPrice,
    get: getPrice
  },
})

function getPrice(num) {
  return (num / 100).toFixed(2);
}

function setPrice(num) {
  return num * 100;
}

module.exports = mongoose.model('wishlist', Wishlist);