
var express = require('express');
var router = express.Router();
var lessonController = require("../controllers/lessonController");


/* GET home page. */
//router.post('/showLesson', lessonController.mostrarLecciones);

router.post('/', lessonController.createLesson); 



module.exports = router;