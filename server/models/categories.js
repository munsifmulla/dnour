var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Categories = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the category'
  },
  slug: {
    type: String,
    required: 'Kindly enter the slug of the category'
  },
  collection_id: {
    type: ObjectId,
    required: "Collection Id is required"
  },
});

module.exports = mongoose.model('categories', Categories);