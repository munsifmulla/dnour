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

exports.editCategory = function (req, res) {
  category.countDocuments(req.id, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Collection not found' })
    } else {
      category.update({ _id: req.body.id }, { $set: req.body }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Category Updated", data: data });
        }
      });
    }
  })
};

exports.deleteCategory = function (req, res) {
  category.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Category not found' })
    } else {
      category.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Category Deleted", data: data });
        }
      });
    }
  })
};

exports.searchCategory = function (req, res) {
  const regex = new RegExp(req.body.text);
  category.find({ name: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Category Deleted", data: data });
    }
  });
};

exports.getAllCategories = function (req, res) {
  category.find({}, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      if (data.length > 0) {
        res.json({ status: 200, message: "Category found", data: data });
      }
      else {
        res.json({ status: 304, message: "No Category found", data: data });
      }
    }
  });
}

function getCategoryById(id, res) {
  console.log(id, 'count');
  category.countDocuments({ _id: id }, (err, count) => {
    if (count > 0) {
      category.findById(id, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Category found", data: data });
        }
      });
    } else {
      return res.json({ status: 304, message: "No Category found", data: err });
    }
  });
}

exports.getCategoryById = (req, res) => getCategoryById(req.params.id, res);