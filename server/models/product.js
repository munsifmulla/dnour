var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var CreateProduct = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the log'
  },
  slug: {
    type: String,
    required: 'Kindly enter the description of the log'
  },
  collection_id: {
    type: ObjectId,
    required: 'Add your code'
  },
  category: {
    type: ObjectId,
    required: 'Add your tags',
    ref: 'categories'
  },
  size: {
    type: ObjectId,
    require: 'Add the sizes for product',
    ref: 'size'
  },
  actual_price: {
    type: Number,
    required: 'Price is required',
    set: setPrice,
    get: getPrice
  },
  offered_price: {
    type: Number,
    required: 'Offered Price is required',
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

module.exports = mongoose.model('product', CreateProduct);