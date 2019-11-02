var express = require('express');
var router = express.Router();
var user = require('../server/controller/user');

router.post('/register', user.createUser);
router.post('/login', user.loginUser);

module.exports = router;