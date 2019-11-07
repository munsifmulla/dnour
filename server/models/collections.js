var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Collections = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the collection'
  },
  slug: {
    type: String,
    required: 'Kindly enter the slug of the collection'
  },
  description: {
    type: String,
    required: 'Kindly enter the description of the collection'
  },
  banner_image: {
    type: String,
    required: 'Kindly upload the banner image of the collection'
  },
  thumb_image: {
    type: String,
    required: 'Kindly upload the thumb image of the collection'
  },
});

module.exports = mongoose.model('collections', Collections);