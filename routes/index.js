var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GccCompiler' });
});

router.get('/new-Alesson', function(req,res,next){
   res.render('new-lesson',{type:1});
});

router.get('/new-Glesson', function(req,res,next){
  res.render('new-lesson',{type:2});
});

module.exports = router;
