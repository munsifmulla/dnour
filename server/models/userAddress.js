const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const UserAddressSchema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
    trim: true
  },
  addr_1: {
    type: String,
    required: true,
  },
  addr_2: {
    type: String,
  },
  addr_3: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  latlng: {
    type: String,
  }
});

module.exports = mongoose.model('user_address', UserAddressSchema);
