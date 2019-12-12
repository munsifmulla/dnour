var mongoose = require('mongoose');
var product = require('../models/product');
var productDescription = require('../models/productDesc');
var productImages = require('../models/productImages');

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
        .populate('category size collection');
    }
  })
};

exports.deleteProduct = function (req, res) {
  product.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    var pr_id = req.body.id;
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product not found' })
    } else {
      return Promise.all([
        productDescription.deleteOne({ product_id: pr_id })
          .exec(),
        productImages.deleteOne({ product_id: pr_id })
          .exec(),
      ])
        .then(function () {
          product.deleteOne({ _id: pr_id }, (err, data) => {
            if (err) {
              res.json({ status: 500, message: "Something went wrong", data: err });
            } else {
              res.json({ status: 200, message: "Product Deleted", data: data });
            }
          });
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
  product.countDocuments({ _id: id }, (err, count) => {
    var pr_id;
    if (count > 0) {
      product.findById(id, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          // console.log('product data', data);
          pr_id = data._id;
          return Promise.all([
            data,
            productDescription.find({ product_id: pr_id })
              .exec(),
            productImages.find({ product_id: pr_id })
              .exec(),
          ])
            .then(function (pr_data) {
              var product = {};
              product.details = pr_data[0];
              product.description = pr_data[1][0];
              product.images = pr_data[2];
              return res.json({ status: 200, message: "Product found", data: product });
            });
        }
      })
        .populate('category size collection');
    } else {
      return res.json({ status: 404, message: "No Product found", data: err });
    }
  });
}

exports.getProductById = (req, res) => getProductById(req.params.id, res);