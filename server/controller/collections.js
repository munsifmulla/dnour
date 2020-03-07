var mongoose = require('mongoose');
var collection = require('../models/collections');
var collectionImages = require('../models/collectionImges');
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.addCollection = function (req, res) {
  const body = {
    name: req.body.name,
    description: req.body.description,
    slug: req.body.name.replace(/ /g, '_').toLowerCase()
  };

  collection.find({ name: body.name }, (err, data) => {
    console.log(data, 'Data')
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Collection Exists' })
    } else {
      collection.create(body, (err, data) => {
        let s_stack = [];
        if (err) {
          res.status(200).json({ status: 500, message: "Something went wrong", data: err });
        } else {
          // upload images
          s_stack = addCollectionImages(req, res, data._id, 'save');
        }
        if (s_stack.includes('error')) {
          res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
        } else {
          res.status(200).json({ status: 200, message: "Collection Created", data: data });
        }

      });
    }
  });
}

exports.editCollection = function (req, res) {
  console.log(req.body, 'Request');
  collection.countDocuments(req.body.id, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Collection not found' })
    } else {
      let body = {
        name: req.body.name,
        description: req.body.description,
        slug: req.body.name.replace(/ /g, '_').toLowerCase()
      };

      collection.findOneAndUpdate({ _id: req.body.id }, { $set: body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Collection Updated", data: data });
        }
      });
    }
  })
};

exports.updateCollectionImages = function (req, res) {
  collectionImages.countDocuments({ _id: req.body.id }, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Collection Image not found' })
    } else {

      collectionImages.findOneAndUpdate({ _id: req.body.id, collection_id: req.body.collection_id },
        {
          $set:
          {
            image_url: req.body.type === 'banner' ?
              req.files.banner_image[0].path.replace("dashboard/images/", process.env.PROJECT_PATH)
              : req.files.thumb_image[0].path.replace("dashboard/images/", process.env.PROJECT_PATH)
          }
        },
        { new: true }, (err, data) => {
          if (err) {
            res.json({ status: 500, message: "Something went wrong", data: err });
          } else {
            res.json({ status: 200, message: "Collection Image Updated", data: data });
          }
        });
    }
  });
}

function addCollectionImages(req, res, data, type) {
  let s_stack = [];
  req.files.banner_image.map(image => {
    let imageBody = {
      collection_id: data,
      image_url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
    }
    collectionImages.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });

  // Thumb Images
  req.files.thumb_image.map(image => {
    let imageBody = {
      collection_id: data,
      image_url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
    }
    collectionImages.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });

  if (type === 'save')
    return s_stack;

  if (s_stack.includes('error')) {
    res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
  } else {
    res.status(200).json({ status: 200, message: "Collection Image added", data: data });
  }
}

//Adding Collection Imahes
exports.addCollectionImages = (req, res) => addCollectionImages(req, res, req.body.collection_id, 'new');

exports.deleteCollectionImages = function (req, res) {
  collectionImages.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Collection Image not found' })
    } else {
      collectionImages.remove({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Collection Image Deleted", data: data });
        }
      });
    }
  })
};

exports.deleteCollection = function (req, res) {
  collection.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Collection not found' })
    } else {
      collection.remove({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Collection Deleted", data: data });
        }
      });
    }
  })
};

exports.searchCollections = function (req, res) {
  const regex = new RegExp(req.body.text);
  collection.find({ name: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Collection Deleted", data: data });
    }
  });
};

exports.getAllCollections = function (req, res) {

  collection.aggregate([
    {
      "$lookup": {
        "from": "collection_images", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "collection_id",
        "as": "images"
      }
    }
  ]).exec().then(function (data) {
    if (data.length > 0) {
      res.json({ status: 200, message: "Collections found", data: data });
    }
    else {
      res.json({ status: 304, message: "No Collections found", data: data });
    }
    // data.map(item => console.log(item))
  }).catch(function (err) {
    res.json({ status: 500, message: "Something went wrong", data: err });
  })
}

function getCollectionById(id, res) {
  console.log(id, 'count');
  collection.aggregate([
    {
      "$match": { _id: mongoose.Types.ObjectId(id) }
    },
    {
      "$lookup": {
        "from": "collection_images", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "collection_id",
        "as": "images"
      }
    }
  ])
    .exec().then(function (data) {
      console.log(data, "data")
      if (data.length > 0) {
        res.json({ status: 200, message: "Collections found", data: data });
      }
      else {
        res.json({ status: 304, message: "No Collections found", data: data });
      }
      // data.map(item => console.log(item))
    }).catch(function (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    })
}

exports.getCollectionById = (req, res) => getCollectionById(req.params.id, res);