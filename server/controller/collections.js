var mongoose = require('mongoose');
var collection = require('../models/collections');

exports.addCollection = function (req, res) {

  collection.create(req.body, (err, data) => {
    if (err) {
      res.status(200).json({ status: 500, message: "Something went wrong", data: err });
    }
    res.status(200).json({ status: 200, message: "Collection Created", data: data });
  });
};

exports.editCollection = function (req, res) {
  collection.countDocuments(req.id, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Collection not found' })
    } else {
      collection.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Collection Updated", data: data });
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