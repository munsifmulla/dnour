var express = require('express');
var router = express.Router();
var multer = require('multer');
var collection = require('../server/controller/collections');
var category = require('../server/controller/categories');
var size = require('../server/controller/sizes');
var product = require('../server/controller/product');
var productDescription = require('../server/controller/productDesc');
var productCADFile = require('../server/controller/productCADFile');
var productImage = require('../server/controller/productImages');
var admin = require('../server/controller/admin');
var wishlist = require('../server/controller/wishlist');
var cart = require('../server/controller/cart');
var user = require('../server/controller/user');
var orders = require('../server/controller/orders');

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

// Admin Users
router.post('/generate-admin', admin.generateUser);
router.post('/delete-admin', admin.deleteUser);
router.get('/list-admins', admin.listUsers);

// Collections
router.post('/collection/add', imageUpload('collection', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), collection.addCollection);
router.post('/collection/edit', collection.editCollection);
router.delete('/collection/delete', collection.deleteCollection);
router.get('/collection/all', collection.getAllCollections);
router.get('/collection/:id', collection.getCollectionById);
router.post('/collection/search', collection.searchCollections);

router.post('/collection-image/add', imageUpload('collection', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), collection.addCollectionImages);
router.post('/collection-image/update', imageUpload('collection', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), collection.updateCollectionImages);
router.post('/collection-image/delete', collection.deleteCollectionImages);

// Category
router.post('/category/add', imageUpload('category', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), category.addCategory);
router.post('/category/edit', category.editCategory);
router.delete('/category/delete', category.deleteCategory);
router.get('/category/all', category.getAllCategories);
router.get('/category/:id', category.getCategoryById);
router.post('/category/search', category.searchCategory);

router.post('/category-image/add', imageUpload('category', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), category.addCategoryImages);
router.post('/category-image/update', imageUpload('category', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), category.updateCategoryImages);
router.post('/category-image/delete', category.deleteCategoryImages);

// Product
router.post('/product/add', imageUpload('product', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }, { name: 'cad_image', maxCount: 6 }]), product.addProduct);
router.post('/product/edit', product.editProduct);
router.delete('/product/delete', product.deleteProduct);
router.get('/product/all', product.getAllProducts);
router.get('/product/:slug', product.getProductBySlug);
router.get('/product/category/:slug', product.getProductByCategory);
router.get('/product/collection/:slug', product.getProductByCollection);
router.post('/product/search', product.searchProducts);

// Product Desc
router.post('/product-description/add', productDescription.addProductDesc);
router.post('/product-description/edit', productDescription.editProductDesc);
router.delete('/product-description/delete', productDescription.deleteProductDesc);
router.get('/product-description/:id', productDescription.getProductDescById);

// Product CAD File
router.post('/product-cad-file/add', imageUpload('product', [{ name: 'cad_image', maxCount: 6 }]), product.addCADFiles);
router.post('/product-cad-file/edit', imageUpload('product', [{ name: 'cad_image', maxCount: 6 }]), productCADFile.editProductCADFile);
router.delete('/product-cad-file/delete', productCADFile.deleteProductCADFile);
router.get('/product-cad-file/all', productCADFile.getAllProductCADFiles);
router.get('/product-cad-file/:id', productCADFile.getProductCADFilesById);
router.post('/product-cad-file/search', productCADFile.searchProductCADFiles);

// Product Images
router.post('/product-image/add', imageUpload('product', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), product.addProductImages);
router.post('/product-image/edit', imageUpload('product', [{ name: 'banner_image', maxCount: 6 }, { name: 'thumb_image', maxCount: 6 }]), productImage.editProductImage);
router.delete('/product-image/delete', productImage.deleteProductImage);
router.get('/product-image/all', productImage.getAllProductImages);
router.get('/product-image/:id', productImage.getProductImageById);
router.post('/product-image/search', productImage.searchProductImage);

// Sizes
router.post('/product-size/add', size.addSize);
router.post('/product-size/edit', size.editSize);
router.delete('/product-size/delete', size.deleteSize);
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

//Ordrs
router.post('/create-order', orders.createOrder);

//User Address
router.post('/address/add', user.addNewAddress);
router.post('/address/update', user.editAddress);
router.delete('/address/delete', user.deleteAddress);
router.get('/address/:userid', user.getAddress);

module.exports = router;