var mongoose = require('mongoose');
var orders = require('../models/orders');
var cart = require('../models/cart');
var product = require('../models/product');
var ObjectId = mongoose.Schema.Types.ObjectId;

exports.createOrder = function (req, res) {
  // get Details of Cart using user_id
  const user_id = req.body.user_id;
  cart.find({ user_id: req.body.user_id })
    .then((response) => {
      //fetch products in cart
      console.log(response, "resp");

      const cartValue = response[0].product.reduce((a, b) => parseInt(parseInt(a) + parseInt(b.actual_price) * 100), 0);
      const discValue = response[0].product.reduce((a, b) => parseInt(parseInt(a) + parseInt(b.offered_price) * 100), 0);

      const body = {
        products: response[0].product,
        address: req.body.address,
        order_value: discValue > 0 ? discValue : cartValue,
        payment_method: req.body.payment_method,
        order_payment_status: req.body.order_payment_status,
        order_placed_date: new Date().toISOString(),
        order_status: 'pending'
      }

      orders.create(body, (err, order) => {
        if (err) {
          res.json({ status: 301, message: "Order Failed, please try again", data: err });
        } else {
          res.json({ status: 200, message: "Your order is placed successfully", data: order });
        }
      })
    })
    .catch(err => {
      res.json({ status: 301, message: "Failed in loading cart, please try again" });
    })
};
