var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var CategoryImages = new Schema({
  category_id: {
    type: ObjectId,
    required: 'Kindly enter the Id of the category'
  },
  image_url: {
    type: String,
    required: 'Kindly enter the image of the category'
  },
});

module.exports = mongoose.model('category_images', CategoryImages);