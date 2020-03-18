var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Cart = new Schema({
  product: [Schema.Types.Mixed],
  // qty: {
  //   type: Number,
  //   required: 'Kindly select the qty.'
  // },
  // size: {
  //   type: String,
  //   required: "Kindly select a size."
  // },
  // color: {
  //   type: String,
  //   required: 'Kindly select the color'
  // },
  user_id: {
    type: ObjectId,
    required: 'User id is required.'
  },
});

module.exports = mongoose.model('cart', Cart);