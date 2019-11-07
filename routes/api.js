var express = require('express');
var router = express.Router();
var collection = require('../server/controller/collections');
var user = require('../server/controller/user');

// Admin Users
router.post('/generate-user', user.generateUser);
router.post('/delete-user', user.deleteUser);
router.get('/list-users', user.listUsers);

// Add Collections
router.post('/collection/add', collection.addCollection);
router.post('/collection/edit', collection.editCollection);
router.delete('/collection/delete', collection.deleteCollection);
router.get('/collection/all', collection.getAllCollections);
router.get('/collection/:id', collection.getCollectionById);
router.post('/collection/search', collection.searchCollections);

module.exports = router;