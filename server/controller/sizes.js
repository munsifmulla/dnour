var mongoose = require('mongoose');
var size = require('../models/size');

exports.addSize = function (req, res) {
  size.find({ name: req.body.type }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Size type exists' })
    } else {
      size.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        }
        res.json({ status: 200, message: "New size created", data: data });
      });
    }
  });
};

exports.editSize = function (req, res) {
  size.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Size type not found' })
    } else {
      size.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Size updated", data: data });
        }
      });
    }
  })
};

exports.deleteSize = function (req, res) {
  size.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Size not found' })
    } else {
      size.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Size Deleted", data: data });
        }
      });
    }
  })
};

exports.searchSize = function (req, res) {
  const regex = new RegExp(req.body.text);
  size.find({ type: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Category Deleted", data: data });
    }
  });
};

exports.getAllSizes = function (req, res) {
  size.find({}, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      if (data.length > 0) {
        res.json({ status: 200, message: "Size found", data: data });
      }
      else {
        res.json({ status: 304, message: "No sizes found", data: data });
      }
    }
  });
}

exports.getSizeById = function (req, res) {
  console.log(req.params.id, 'count');
  size.countDocuments({ _id: req.params.id }, (err, count) => {
    if (count > 0) {
      size.findById(req.params.id, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Size found", data: data });
        }
      });
    } else {
      return res.json({ status: 304, message: "No Size found", data: err });
    }
  });
}