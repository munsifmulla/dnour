var express = require('express');
var router = express.Router();
var collection = require('../server/controller/collections');
var category = require('../server/controller/categories');
var size = require('../server/controller/sizes');
var product = require('../server/controller/product');
var productCADFile = require('../server/controller/productCADFile');
var user = require('../server/controller/user');

// Admin Users
router.post('/generate-user', user.generateUser);
router.post('/delete-user', user.deleteUser);
router.get('/list-users', user.listUsers);

// Collections
router.post('/collection/add', collection.addCollection);
router.post('/collection/edit', collection.editCollection);
router.delete('/collection/delete', collection.deleteCollection);
router.get('/collection/all', collection.getAllCollections);
router.get('/collection/:id', collection.getCollectionById);
router.post('/collection/search', collection.searchCollections);

// Category
router.post('/category/add', category.addCategory);
router.post('/category/edit', category.editCategory);
router.delete('/category/delete', category.deleteCategory);
router.get('/category/all', category.getAllCategories);
router.get('/category/:id', category.getCategoryById);
router.post('/category/search', category.searchCategory);

// Product
router.post('/product/add', product.addProduct);
router.post('/product/edit', product.editProduct);
router.delete('/product/delete', product.deleteProduct);
router.get('/product/all', product.getAllProducts);
router.get('/product/:id', product.getProductById);
router.post('/product/search', product.searchProducts);

// Product CAD File
router.post('/product-cad-file/add', productCADFile.addProductCADFile);
router.post('/product-cad-file/edit', productCADFile.editProductCADFile);
router.delete('/product-cad-file/delete', productCADFile.deleteProductCADFile);
router.get('/product-cad-file/all', productCADFile.getAllProductCADFiles);
router.get('/product-cad-file/:id', productCADFile.getProductCADFilesById);
router.post('/product-cad-file/search', productCADFile.searchProductCADFiles);

// Sizes
router.post('/product-size/add', size.addSize);
router.post('/product-size/edit', size.editSize);
router.delete('/product-size/delete', size.deleteSize);
router.get('/product-size/all', size.getAllSizes);
router.get('/product-size/:id', size.getSizeById);
router.post('/product-size/search', size.searchSize);

module.exports = router;