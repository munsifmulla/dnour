var mongoose = require('mongoose');
var product = require('../models/product');

exports.addProduct = function (req, res) {
  product.find({ name: req.body.type }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Product type exists' })
    } else {
      product.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        }
        res.json({ status: 200, message: "New Product created", data: data });
      });
    }
  });
};

exports.editProduct = function (req, res) {
  product.countDocuments(req.id, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product not found' })
    } else {
      product.findOneAndUpdate({ _id: req.body.id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product Updated", data: data });
        }
      })
        .populate('category size');
    }
  })
};

exports.deleteProduct = function (req, res) {
  product.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product not found' })
    } else {
      product.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product Deleted", data: data });
        }
      });
    }
  })
};

exports.searchProducts = function (req, res) {
  const regex = new RegExp(req.body.text);
  product.find({ name: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Product found", data: data });
    }
  })
    .populate('category size');
};

exports.getAllProducts = function (req, res) {
  product.find()
    .populate('category size')
    .exec((err, data) => {
      if (err) {
        res.json({ status: 500, message: "Something went wrong", data: err });
      } else {
        if (data.length > 0) {
          res.json({ status: 200, message: "Product found", data: data });
        }
        else {
          res.json({ status: 304, message: "No Product found", data: data });
        }
      }
    })
}

function getProductById(id, res) {
  console.log(id, 'count');
  product.countDocuments({ _id: id }, (err, count) => {
    if (count > 0) {
      product.findById(id, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Product found", data: data });
        }
      })
        .populate('category size');
    } else {
      return res.json({ status: 304, message: "No Product found", data: err });
    }
  });
}

exports.getProductById = (req, res) => getProductById(req.params.id, res);