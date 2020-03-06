var mongoose = require('mongoose');
var collection = require('../models/collections');
var collectionImages = require('../models/collectionImges');

exports.addCollection = function (req, res) {
  const body = {
    name: req.body.name,
    description: req.body.description,
    slug: req.body.name.replace(/ /g, '_').toLowerCase()
  };

  collection.create(body, (err, data) => {
    const s_stack = [];
    console.log("Created!!")
    if (err) {
      res.status(200).json({ status: 500, message: "Something went wrong", data: err });
    } else {
      // Large / banner Images
      req.files.banner_image.map(image => {
        let imageBody = {
          collection_id: data._id,
          image_url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
        }
        collectionImages.create(imageBody, (err, imageData) => {
          s_stack.push(err ? 'error' : 'success');
        });
      });

      // Thumb Images
      req.files.thumb_image.map(image => {
        let imageBody = {
          collection_id: data._id,
          image_url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
        }
        collectionImages.create(imageBody, (err, imageData) => {
          s_stack.push(err ? 'error' : 'success');
        });
      })

    }
    if (s_stack.includes('error')) {
      res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
    } else {
      res.status(200).json({ status: 200, message: "Collection Created", data: data });
    }

  });
};

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
  collection.find({}, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      if (data.length > 0) {
        res.json({ status: 200, message: "Collections found", data: data });
      }
      else {
        res.json({ status: 304, message: "No Collections found", data: data });
      }
    }
  });
}

function getCollectionById(id, res) {
  console.log(id, 'count');
  collection.countDocuments(id, (err, count) => {
    if (count > 0) {
      collection.findById(id, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Collections found", data: data });
        }
      });
    } else {
      return res.json({ status: 304, message: "No Collection found", data: err });
    }
  });
}

exports.getCollectionById = (req, res) => getCollectionById(req.params.id, res);