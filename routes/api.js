var express = require('express');
var router = express.Router();
var challenge = require('../server/controller/controller');
var user = require('../server/controller/user');

router.post('/create-log', challenge.createLog);
router.get('/list-log', challenge.listLog);
router.post('/find-log', challenge.findLog);
router.post('/get-log', challenge.getLog);

module.exports = router;