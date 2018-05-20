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

router.post('/save-value', function(req, res){
	var msg = req.body.msg;
	res.send(msg);
});


module.exports = router;
