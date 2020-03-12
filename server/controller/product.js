var mongoose = require('mongoose');
var product = require('../models/product');
var productDescription = require('../models/productDesc');
var productImages = require('../models/productImages');
var productCADFile = require('../models/productCADFile');
var category = require('../models/categories');
var collection = require('../models/collections');

exports.addProduct = function (req, res) {
  product.find({ name: req.body.name }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Product already exists' })
    } else {

      let product_body = {
        ...req.body,
        ...{ slug: req.body.name.replace(/ /g, '-').toLowerCase() }
      };

      product.create(product_body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          //Add description
          let descStatus = addProductDescription(data._id, req.body);
          let productImageStatus = addProductImages(req, res, data._id, 'save');
          let CADImageStatus = addCADFiles(req, res, data._id, 'save');

          let statusStack = [...descStatus, ...productImageStatus, ...CADImageStatus];

          if (statusStack.includes('error')) {
            res.json({ status: 500, message: "Something went wrong in adding a product", data: err });
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

function addProductImages(req, res, productId, type) {
  let s_stack = [];
  req.files.banner_image.map(image => {
    let imageBody = {
      product_id: productId,
      url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH),
      type: 'banner'
    }
    productImages.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });

  // Thumb Images
  req.files.thumb_image.map(image => {
    let imageBody = {
      product_id: productId,
      url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH),
      type: 'thumb'
    }
    productImages.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });

  if (type === 'save')
    return s_stack;

  if (s_stack.includes('error')) {
    res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
  } else {
    res.status(200).json({ status: 200, message: "Image added", data: data });
  }
}

//Add new Image
exports.addProductImages = (req, res) => addProductImages(req, res, req.body.product_id, 'new');

function addCADFiles(req, res, productId, type) {
  let s_stack = [];
  req.files.cad_image.map(image => {
    let imageBody = {
      product_id: productId,
      cad_file: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
    }
    productCADFile.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });
  if (type === 'save')
    return s_stack;

  if (s_stack.includes('error')) {
    res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
  } else {
    res.status(200).json({ status: 200, message: "Image added", data: data });
  }
}

//Add new Cad File
exports.addCADFiles = (req, res) => addCADFiles(req, res, req.body.product_id, 'new');

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
      });
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

function getProductBySlug(slug, res) {
  product.aggregate([
    {
      "$match": { slug: slug }
      // "$match": { category: mongoose.Types.ObjectId(slug) }
    },
    {
      "$lookup": {
        "from": "product_descriptions", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "product_id",
        "as": "description"
      }
    },
    {
      "$lookup": {
        "from": "product_images", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "product_id",
        "as": "images"
      }
    },
    {
      "$lookup": {
        "from": "product_cad_files", //collection name
        "localField": "_id", // uid is exists in both collection
        "foreignField": "product_id",
        "as": "cad_images"
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

exports.getProductByCategory = function (req, res) {
  category.aggregate([
    {
      "$match": { slug: req.params.slug }
    },
  ])
    .exec()
    .then((category) => {
      product.aggregate([
        {
          "$match": { category: mongoose.Types.ObjectId(category[0]._id) }
        },
        {
          "$lookup": {
            "from": "product_descriptions", //collection name
            "localField": "_id", // uid is exists in both collection
            "foreignField": "product_id",
            "as": "description"
          }
        },
        {
          "$lookup": {
            "from": "product_images", //collection name
            "localField": "_id", // uid is exists in both collection
            "foreignField": "product_id",
            "as": "images"
          }
        },
        {
          "$lookup": {
            "from": "product_cad_files", //collection name
            "localField": "_id", // uid is exists in both collection
            "foreignField": "product_id",
            "as": "cad_images"
          }
        }
      ]).exec().then(function (data) {
        console.log(data, "Data");
        if (data.length > 0) {
          res.json({ status: 200, message: "Product found", data: data });
        }
        else {
          res.json({ status: 304, message: "No Product found", data: data });
        }
      }).catch(function (err) {
        res.json({ status: 500, message: "Something went wrong", data: err });
      });
    })
    .catch((err) => console.log(err, "Error"));
}

exports.getProductByCollection = function (req, res) {
  collection.aggregate([
    {
      "$match": { slug: req.params.slug }
    },
  ])
    .exec()
    .then((collection) => {
      product.aggregate([
        {
          "$match": { collection_id: mongoose.Types.ObjectId(collection[0]._id) }
        },
        {
          "$lookup": {
            "from": "product_descriptions", //collection name
            "localField": "_id", // uid is exists in both collection
            "foreignField": "product_id",
            "as": "description"
          }
        },
        {
          "$lookup": {
            "from": "product_images", //collection name
            "localField": "_id", // uid is exists in both collection
            "foreignField": "product_id",
            "as": "images"
          }
        },
        {
          "$lookup": {
            "from": "product_cad_files", //collection name
            "localField": "_id", // uid is exists in both collection
            "foreignField": "product_id",
            "as": "cad_images"
          }
        }
      ])
        .exec()
        .then(function (data) {
          console.log(data, "Data");
          if (data.length > 0) {
            res.json({ status: 200, message: "Product found", data: data });
          }
          else {
            res.json({ status: 304, message: "No Product found", data: data });
          }
        }).catch(function (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        });
    })
    .catch((err) => console.log(err, "Error"));
}

exports.getProductBySlug = (req, res) => getProductBySlug(req.params.slug, res);