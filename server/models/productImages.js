var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var ProductImages = new Schema({
  type: {
    type: String,
    required: 'Kindly select the type for the product image'
  },
  url: {
    type: String,
    required: 'Kindly select the image for product',
    validate: {
      validator: function (v) {
        return /([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)/.test(v);
      },
      message: props => `${ props.value } is not a valid image file!`
    },
  },
  product_id: {
    type: ObjectId,
    required: 'Product ID is required'
  },
})

function getPrice(num) {
  return (num / 100).toFixed(2);
}

function setPrice(num) {
  return num * 100;
}

module.exports = mongoose.model('product_images', ProductImages);