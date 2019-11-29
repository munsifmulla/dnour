var mongoose = require('mongoose');
var productImages = require('../models/productImages');

exports.addProductImage = function (req, res) {
  productImages.find({ url: req.body.url }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Image file exists' })
    } else {
      productImages.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 422, message: "Something went wrong", data: err.message });
        } else {
          res.json({ status: 200, message: "New Product Image added", data: data });
        }
      });
    }
  });
};

exports.editProductImage = function (req, res) {
  productImages.countDocuments(req.body.product_id, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Image not found' });
    } else {
      productImages.findOneAndUpdate({ product_id: req.body.product_id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product Image Updated", data: data });
        }
      })
    }
  })
};

exports.deleteProductImage = function (req, res) {
  productImages.countDocuments({ _id: req.body.id }, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product not found' })
    } else {
      productImages.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product Image Deleted", data: data });
        }
      });
    }
  })
};

exports.searchProductImage = function (req, res) {
  const regex = new RegExp(req.body.cad_file);
  productImages.find({ cad_file: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Product Image found", data: data });
    }
  })
};

exports.getAllProductImages = function (req, res) {
  productImages.find()
    .exec((err, data) => {
      if (err) {
        res.json({ status: 500, message: "Something went wrong", data: err });
      } else {
        if (data.length > 0) {
          res.json({ status: 200, message: `Product Image found`, data: data });
        }
        else {
          res.json({ status: 304, message: "No Product Image were found", data: data });
        }
      }
    })
}

function getProductImageById(id, res) {
  productImages.countDocuments({ product_id: id }, (err, count) => {
    if (count > 0) {
      productImages.find({ product_id: id }, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Product Image found", data: data });
        }
      })
    } else {
      return res.json({ status: 304, message: "No Product Image found", data: err });
    }
  });
}

exports.getProductImageById = (req, res) => getProductImageById(req.params.id, res);