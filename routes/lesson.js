
var express = require('express');
var router = express.Router();
var lessonController = require("../controllers/lessonController");


/* GET home page. */
router.get('/bulkLoad', lessonController.mostrarLecciones);

router.post('/post', lessonController.createLesson); 

router.get('/get', lessonController.getLesson);

router.post('/take', lessonController.takeLesson);



module.exports = router;