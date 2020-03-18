var mongoose = require('mongoose');
var cart = require('../models/cart');
var product = require('../models/product');
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.addToCart = function (req, res) {
  cart.find({ user_id: req.body.user_id }, (err, data) => {

    product.find({ _id: req.body.product })
      .then((response) => {
        const temp_product = {
          product_id: req.body.product,
          actual_price: response[0].actual_price,
          offered_price: response[0].offered_price,
          qty: req.body.qty,
          color: req.body.color,
          size: req.body.size
        };

        if (data.length === 0) {
          let product = [];//Create new cart
          product.push(temp_product);

          cart.create({ user_id: req.body.user_id, product: [...product] }, (err, data) => {
            if (err) {
              res.json({ status: 500, message: "Something went wrong", data: err });
            } else {
              res.json({ status: 200, message: "Added to Cart", data: data });
            }
          });
        } else { // Update qty in cart
          let product = data[0].product || [];
          //Find if Product is in cart
          let found = product.find(item => item.product_id === req.body.product);
          let itemIndex = product.indexOf(found);
          if (found) {
            product.splice(itemIndex, 1);
            product.push(temp_product)
          } else {
            product.push(temp_product)
          }

          cart.findOneAndUpdate({ user_id: req.body.user_id }, { $set: { product: product } }, { new: true }, (err, data) => {
            if (err) {
              res.json({ status: 500, message: "Something went wrong", data: err });
            } else {
              res.json({ status: 200, message: "Cart Updated", data: data });
            }
          });
        }
      });
  });
};

exports.deleteFromCart = function (req, res) {
  cart.find({ user_id: req.body.user_id }, (err, data) => {
    if (data[0].product.length > 0) {
      let product = data[0].product || [];
      //Find if Product is in cart
      let found = product.find(item => item.product_id === req.body.product);
      let itemIndex = product.indexOf(found);
      if (found) {
        product.splice(itemIndex, 1);
      } else {
        res.status(404).json({ status: 404, message: 'Item not found in your cart.' })
      }

      cart.findOneAndUpdate({ user_id: req.body.user_id }, { $set: { product: product } }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Cart item deleted", data: data });
        }
      });
    } else {
      res.status(404).json({ status: 404, message: 'Your cart is empty.' })
    }
  })
};

function getCart(id, res) {
  cart.find({ user_id: id }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      console.log(data[0].product, "Data")
      if (data[0].product.length > 0) {
        const itemsCount = data[0].product.length;
        const cartValue = data[0].product.reduce((a, b) => parseInt(parseInt(a) + parseInt(b.actual_price) * 100), 0);
        const discValue = data[0].product.reduce((a, b) => parseInt(parseInt(a) + parseInt(b.offered_price) * 100), 0);
        const totalSavings = parseInt(cartValue - discValue);
        const vatCollected = parseInt(((discValue > 0 ? discValue : cartValue) * process.env.VAT) / 100);

        res.json({ status: 200, message: "Cart items found", data: { user_id: data[0].user_id, products: data[0].product, itemsCount, cartValue, discValue, totalSavings, vatCollected } });
      }
      else {
        res.json({ status: 304, message: "Cart is empty", data: data });
      }
    }
  })
};


exports.getCart = (req, res) => getCart(req.params.id, res);