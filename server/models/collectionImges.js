var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var CollectionImages = new Schema({
  collection_id: {
    type: ObjectId,
    required: 'Kindly enter the name of the collection'
  },
  image_url: {
    type: String,
    required: 'Kindly enter the slug of the collection'
  },
});

module.exports = mongoose.model('collection_images', CollectionImages);