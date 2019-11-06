var express = require('express');
var router = express.Router();
var dnour = require('../server/controller/controller');
var user = require('../server/controller/user');

router.post('/create-log', dnour.createLog);
router.get('/list-log', dnour.listLog);
router.post('/find-log', dnour.findLog);
router.post('/get-log', dnour.getLog);
//Generate user
router.post('/generate-user', user.generateUser);
router.post('/delete-user', user.deleteUser);

module.exports = router;