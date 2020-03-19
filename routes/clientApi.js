var express = require('express');
var router = express.Router();
var multer = require('multer');
var collection = require('../server/controller/collections');
var category = require('../server/controller/categories');
var size = require('../server/controller/sizes');
var product = require('../server/controller/product');
var productDescription = require('../server/controller/productDesc');
var productCADFile = require('../server/controller/productCADFile');
var wishlist = require('../server/controller/wishlist');
var cart = require('../server/controller/cart');
var user = require('../server/controller/user');

//Helper Function for uploading images
//Takes in parameter of path, size and mime type
var imageUpload = function (uploadFolder, field) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./dashboard/images/app/${ uploadFolder }`)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + file.originalname.replace(/ /g, '-'));
    }
  });

  function sayError(error) {
    console.log(error)
  }

  var fileFilter = function (req, file, cb) {
    console.log(file.mimetype, "Mime")
    var acceptedMimeTypes = ['image/jpeg', 'image/png']; //Allowed Mime types JPG and PNG
    if (acceptedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(sayError("Mime not supported"), false);
    }
  }

  var upload = multer({
    storage: storage,
    limit: {
      fileSize: 1024 * 1024 * 5, //Max 5 MB of file size
    },
    fileFilter: fileFilter,
  }
  );
  return upload.fields(field, 20);
}

//Login and Register
router.post('/register', user.createUser);
router.post('/login', user.loginUser);

// Collections
router.get('/collection/all', collection.getAllCollections);
router.get('/collection/:id', collection.getCollectionById);
router.post('/collection/search', collection.searchCollections);

// Category
router.get('/category/all', category.getAllCategories);
router.get('/category/:id', category.getCategoryById);
router.post('/category/search', category.searchCategory);

// Product
router.get('/product/all', product.getAllProducts);
router.get('/product/:slug', product.getProductBySlug);
router.get('/product/category/:slug', product.getProductByCategory);
router.get('/product/collection/:slug', product.getProductByCollection);
router.post('/product/search', product.searchProducts);

// Product Desc
router.get('/product-description/:id', productDescription.getProductDescById);

// Product CAD File
router.get('/product-cad-file/all', productCADFile.getAllProductCADFiles);
router.get('/product-cad-file/:id', productCADFile.getProductCADFilesById);
router.post('/product-cad-file/search', productCADFile.searchProductCADFiles);

// Sizes
router.get('/product-size/all', size.getAllSizes);
router.get('/product-size/:id', size.getSizeById);
router.post('/product-size/search', size.searchSize);

//wishlist
router.post('/wishlist/add', wishlist.addProduct);
router.get('/wishlist', wishlist.getAllProducts);
router.delete('/wishlist/delete', wishlist.deleteProduct);

// cart
router.post('/cart/update', cart.addToCart);
router.delete('/cart/delete', cart.deleteFromCart);
router.get('/cart/:id', cart.getCart);

module.exports = router;