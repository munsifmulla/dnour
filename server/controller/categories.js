var mongoose = require('mongoose');
var category = require('../models/categories');
var categoryImages = require('../models/categoryImages');

exports.addCategory = function (req, res) {
  const body = {
    name: req.body.name,
    collection_id: req.body.collection_id,
    slug: req.body.name.replace(/ /g, '_').toLowerCase()
  };

  category.find({ name: body.name }, (err, data) => {
    console.log(data, 'Data')
    if (data.length > 0) {
      res.status(422).json({ status: 422, message: 'Category Exists' })
    } else {
      category.create(body, (err, data) => {
        const s_stack = [];
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          // Upload Images
          addCategoryImages(req, res, data._id, 'save')

        }
        if (s_stack.includes('error')) {
          res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
        } else {
          res.status(200).json({ status: 200, message: "Category Created", data: data });
        }
      });
    }
  });
};

exports.editCategory = function (req, res) {
  category.countDocuments(req.id, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Category not found' })
    } else {
      const body = {
        name: req.body.name,
        category_id: req.body.category_id,
        slug: req.body.name.replace(/ /g, '_').toLowerCase()
      };

      category.findOneAndUpdate({ _id: req.body.id }, { $set: body }, { new: true }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Category Updated", data: data });
        }
      });
    }
  })
};

exports.updateCategoryImages = function (req, res) {
  categoryImages.countDocuments({ _id: req.body.id }, (err, count) => {
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Category Image not found' })
    } else {

      categoryImages.findOneAndUpdate({ _id: req.body.id, category_id: req.body.category_id },
        {
          $set:
          {
            image_url: req.body.type === 'banner' ?
              req.files.banner_image[0].path.replace("dashboard/images/", process.env.PROJECT_PATH)
              : req.files.thumb_image[0].path.replace("dashboard/images/", process.env.PROJECT_PATH)
          }
        },
        { new: true }, (err, data) => {
          if (err) {
            res.json({ status: 500, message: "Something went wrong", data: err });
          } else {
            res.json({ status: 200, message: "Category Image Updated", data: data });
          }
        });
    }
  });
}

// Adding Category Imahes
function addCategoryImages(req, res, data, type) { // req, res, data._id, 'save'/'new'
  let s_stack = [];
  req.files.banner_image.map(image => {
    let imageBody = {
      category_id: data,
      image_url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
    }
    categoryImages.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });

  // Thumb Images
  req.files.thumb_image.map(image => {
    let imageBody = {
      category_id: data,
      image_url: image.path.replace("dashboard/images/", process.env.PROJECT_PATH)
    }
    categoryImages.create(imageBody, (err, imageData) => {
      s_stack.push(err ? 'error' : 'success');
    });
  });

  if (type === 'save')
    return s_stack;

  if (s_stack.includes('error')) {
    res.status(200).json({ status: 500, message: "Something went wrong while uploading images, please try again", data: err });
  } else {
    res.status(200).json({ status: 200, message: "category Image added", data: data });
  }
}
exports.addCategoryImages = (req, res) => addCategoryImages(req, res, req.body.category_id, 'new');

// Delete Category Imahes
exports.deleteCategoryImages = function (req, res) {
  categoryImages.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Category Image not found' })
    } else {
      categoryImages.remove({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Category Image Deleted", data: data });
        }
      });
    }
  })
};

exports.deleteCategory = function (req, res) {
  category.countDocuments({ _id: req.body.id }, (err, count) => {
    console.log(count, 'count');
    if (count === 0) {
      res.status(404).json({ status: 404, message: 'Category not found' })
    } else {
      category.deleteOne({ _id: req.body.id }, (err, data) => {
        if (err) {
          res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          res.json({ status: 200, message: "Category Deleted", data: data });
        }
      });
    }
  })
};

exports.searchCategory = function (req, res) {
  const regex = new RegExp(req.body.text);
  category.find({ name: regex }, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      res.json({ status: 200, message: "Category Deleted", data: data });
    }
  });
};

exports.getAllCategories = function (req, res) {
  category.find({}, (err, data) => {
    if (err) {
      res.json({ status: 500, message: "Something went wrong", data: err });
    } else {
      if (data.length > 0) {
        res.json({ status: 200, message: "Category found", data: data });
      }
      else {
        res.json({ status: 304, message: "No Category found", data: data });
      }
    }
  });
}

function getCategoryById(id, res) {
  console.log(id, 'count');
  category.countDocuments({ _id: id }, (err, count) => {
    if (count > 0) {
      category.find(id, (err, data) => {
        if (err) {
          return res.json({ status: 500, message: "Something went wrong", data: err });
        } else {
          return res.json({ status: 200, message: "Category found", data: data });
        }
      });
    } else {
      return res.json({ status: 304, message: "No Category found", data: err });
    }
  });
}

exports.getCategoryById = (req, res) => getCategoryById(req.params.id, res);