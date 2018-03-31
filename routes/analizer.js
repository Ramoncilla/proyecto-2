var express = require('express');
var router = express.Router();
var parserController = require('../controllers/parserController');

/* GET home page. */
router.post('/', parserController.parse_string);

module.exports = router;
