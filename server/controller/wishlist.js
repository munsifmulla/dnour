var mongoose = require('mongoose');
var wishlist = require('../models/wishlist');

exports.addProduct = function (req, res) {
  wishlist.find({ user_id: req.body.user_id, product_id: req.body.product_id }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Product already in wishlist' })
    } else {
      wishlist.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        }
        res.json({ status: 200, message: "New Product added to wishlist", data: data });
      });
    }
  });
};

exports.deleteProduct = function (req, res) {
  wishlist.countDocuments({ _id: req.body.id }, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product not found' })
    } else {
      wishlist.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product removed from wishlist", data: data });
        }
      });
    }
  })
};

exports.getAllProducts = function (req, res) {
  wishlist.find()
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