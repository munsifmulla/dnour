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
  banner_image: {
    type: String,
    required: 'Kindly upload the banner image of the category'
  },
  thumb_image: {
    type: String,
    required: 'Kindly upload the thumb image of the category'
  },
});

module.exports = mongoose.model('categories', Categories);