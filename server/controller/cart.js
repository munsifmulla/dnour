var mongoose = require('mongoose');
var cart = require('../models/cart');

exports.addToCart = function (req, res) {
  cart.find({ product: req.body.product }, (err, data) => {
    console.log(data, 'Data')
    if (data.length > 0) {
      //Update Quantity
      cart.findOneAndUpdate({ product: req.body.product }, { $set: { qty: req.body.qty } }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Category Updated", data: data });
        }
      });
    } else {
      cart.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        }
        res.json({ status: 200, message: "Product added to cart", data: data });
      });
    }
  });
};

exports.deleteFromCart = function (req, res) {
  cart.countDocuments({ product: req.body.product }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'This product is not in your cart.' })
    } else {
      cart.deleteOne({ product: req.body.product }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product removed from cart.", data: data });
        }
      });
    }
  })
};

exports.getAllCartItems = function (req, res) {
  cart.find({}, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      if (data.length > 0) {
        res.json({ status: 200, message: "Cart items found", data: data });
      }
      else {
        res.json({ status: 304, message: "Cart is empty", data: data });
      }
    }
  })
    .populate('product');
}

exports.getCategoryById = (req, res) => getCategoryById(req.params.id, res);