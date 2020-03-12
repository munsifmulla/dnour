var express = require('express');
var router = express.Router();
var admin = require('../server/controller/admin');

router.post('/register', admin.createUser);
router.post('/login', admin.loginUser);

module.exports = router;