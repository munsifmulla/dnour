var mongoose = require('mongoose');
var productDescription = require('../models/productDesc');

exports.addProductDesc = function (req, res) {
  productDescription.find({ product_id: req.body.product_id }, (err, data) => {
    if (data && data.length > 0) {
      res.status(422).json({ status: 422, message: 'Product Description exists' })
    } else {
      productDescription.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        }
        res.json({ status: 200, message: "Product Description added", data: data });
      });
    }
  });
};

exports.editProductDesc = function (req, res) {
  productDescription.countDocuments(req.body.product_id, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product Description not found' })
    } else {
      product.findOneAndUpdate({ _id: req.body.product_id }, { $set: req.body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product Description Updated", data: data });
        }
      })
    }
  })
};

exports.deleteProductDesc = function (req, res) {
  productDescription.countDocuments({ _id: req.body.product_id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product description not found' })
    } else {
      product.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product description Deleted", data: data });
        }
      });
    }
  })
};

// exports.searchProductsDesc = function (req, res) {
//   const regex = new RegExp(req.body.text);
//   productDescription.find({ name: regex }, (err, data) => {
//     if (err) {
//       res.json({ status: 500, message: "Something went wrong", data: err });
//     } else {
//       res.json({ status: 200, message: "Product found", data: data });
//     }
//   })
//     .populate('category size');
// };

// exports.getAllProducts = function (req, res) {
//   product.find()
//     .populate('category size')
//     .exec((err, data) => {
//       if (err) {
//         res.json({ status: 500, message: "Something went wrong", data: err });
//       } else {
//         if (data.length > 0) {
//           res.json({ status: 200, message: "Product found", data: data });
//         }
//         else {
//           res.json({ status: 304, message: "No Product found", data: data });
//         }
//       }
//     })
// }

function getProductDescById(id, res) {
  productDescription.countDocuments({ product_id: id }, (err, count) => {
    if (count > 0) {
      productDescription.find({ product_id: id }, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Product Description found", data: data });
        }
      })
    } else {
      return res.json({ status: 404, message: "No Product Description found", data: err });
    }
  });
}

exports.getProductDescById = (req, res) => getProductDescById(req.params.id, res);