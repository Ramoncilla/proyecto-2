var express = require('express');
var router = express.Router();
var editorController = require('../controllers/editorController');


router.get('/', function(req,res,next){
  res.render('editor');
});

router.post('/build', editorController.build);
router.post('/debug', editorController.debug);
router.post('/resume', editorController.resume);
router.post('/next', editorController.next);
router.post('/skip', editorController.skip);
router.post('/automatic', editorController.automatic);
router.post('/export', editorController.export);
router.post('/import', editorController.import);
router.post('/test', editorController.test);

module.exports = router;
