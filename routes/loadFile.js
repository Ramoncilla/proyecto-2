var express = require('express');
var router = express.Router();
var loadController = require("../controllers/LoadController");


/* GET home page. */
router.post('/', loadController.load_file); 

module.exports = router;