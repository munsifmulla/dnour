var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var ProductCADFile = new Schema({
  cad_file: {
    type: String,
    required: 'Kindly select the CAD file for the product'
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

module.exports = mongoose.model('product_cad_files', ProductCADFile);