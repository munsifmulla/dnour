var mongoose = require('mongoose');
var productCADFile = require('../models/productCADFile');

exports.addProductCADFile = function (req, res) {
  productCADFile.find({ cad_file: req.body.cad_file }, (err, data) => {
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'CAD File name exists' })
    } else {
      productCADFile.create(req.body, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        }
        res.json({ status: 200, message: "New Product CAD File added", data: data });
      });
    }
  });
};

exports.editProductCADFile = function (req, res) {
  productCADFile.countDocuments(req.body.product_id, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'CAD File not found' });
    } else {
      productCADFile.findOneAndUpdate({ product_id: req.body.product_id }, { $set: { cad_file: req.body.cad_file } }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product CAD File Updated", data: data });
        }
      })
    }
  })
};

exports.deleteProductCADFile = function (req, res) {
  productCADFile.countDocuments({ _id: req.body.id }, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Product not found' })
    } else {
      productCADFile.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Product CAD File Deleted", data: data });
        }
      });
    }
  })
};

exports.searchProductCADFiles = function (req, res) {
  const regex = new RegExp(req.body.cad_file);
  productCADFile.find({ cad_file: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Product CAD File found", data: data });
    }
  })
};

exports.getAllProductCADFiles = function (req, res) {
  productCADFile.find()
    .exec((err, data) => {
      if (err) {
        res.json({ status: 500, message: "Something went wrong", data: err });
      } else {
        if (data.length > 0) {
          res.json({ status: 200, message: `Product CAD Flles found`, data: data });
        }
        else {
          res.json({ status: 304, message: "No Product CAD Files were found", data: data });
        }
      }
    })
}

function getProductCADFilesById(id, res) {
  productCADFile.countDocuments({ product_id: id }, (err, count) => {
    if (count > 0) {
      productCADFile.find({ product_id: id }, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Product CAD File found", data: data });
        }
      })
    } else {
      return res.json({ status: 304, message: "No Product CAD File found", data: err });
    }
  });
}

exports.getProductCADFilesById = (req, res) => getProductCADFilesById(req.params.id, res);