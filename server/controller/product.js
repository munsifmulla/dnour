var mongoose = require('mongoose');
var product = require('../models/product');
var productDescription = require('../models/productDesc');
var productImages = require('../models/productImages');

exports.addProduct = function (req, res) {
  product.find({ name: req.body.name }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Product already exists' })
    } else {

      let product_body = {
        ...req.body,
        ...{ slug: req.body.name.replace(/ /g, '_').toLowerCase() }
      };

      product.create(product_body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          //Add description
          let status = addProductDescription(data._id, req.body);
          console.log(status, "Status");

          if (status === 'error') {
            res.json({ status: 500, message: "Something went wrong in adding desc", data: err });
          } else {
            res.json({ status: 200, message: "New product added" });
          }
        }
      });
    }
  });
};

function addProductDescription(product_id, body) {
  let disp_stack = [];
  var descBody = {
    product_id: product_id,
    description: body.description,
    karat_gold: body.gold_material,
    weight_gold: body.gold_weight,
    weight_stones: body.stone_weight,
    color_gold: body.gold_color
  };
  productDescription.create(descBody, (err, data) => {
    disp_stack.push(err ? 'error' : 'success');
  });

  return disp_stack;
}

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
        productDescription.remove({ product_id: pr_id })
          .exec(),
        productImages.remove({ product_id: pr_id })
          .exec(),
      ])
        .then(function () {
          product.remove({ _id: pr_id }, (err, data) => {
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

  product.aggregate([
    {
      "$lookup": {
        "from": "product_descriptions", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "product_id",
        "as": "description"
      }
    }
  ]).exec().then(function (data) {
    if (data.length > 0) {
      res.json({ status: 200, message: "Products found", data: data });
    }
    else {
      res.json({ status: 304, message: "No Products found", data: data });
    }
  }).catch(function (err) {
    res.json({ status: 500, message: "Something went wrong", data: err });
  });
}

function getProductById(id, res) {
  product.aggregate([
    {
      "$match": { _id: mongoose.Types.ObjectId(id) }
    },
    {
      "$lookup": {
        "from": "product_descriptions", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "product_id",
        "as": "description"
      }
    }
  ]).exec().then(function (data) {
    if (data.length > 0) {
      res.json({ status: 200, message: "Product found", data: data });
    }
    else {
      res.json({ status: 304, message: "No Product found", data: data });
    }
  }).catch(function (err) {
    res.json({ status: 500, message: "Something went wrong", data: err });
  });
}

exports.getProductById = (req, res) => getProductById(req.params.id, res);