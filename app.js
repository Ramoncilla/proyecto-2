var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var analizerRouter = require('./routes/analizer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lessonRouter = require('./routes/lesson');
var loadController = require('./routes/loadFile');
var editorRouter = require('./routes/editor');



var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var flag = false;
io.on('connection', function(socket){ 
	console.log("client connected");
	socket.on('send.message', function(data){
    	
    	console.log("message ", data.message);
		socket.emit('message', {
			
			message : "adf"
			
		});

    });
  socket.on('send.value', function(data){
      flag = true;
  });


});
global.io = io;
global.flag = flag;
server.listen(4200);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/parser',analizerRouter);
app.use('/new-Glesson',indexRouter);
app.use('/new-Alesson',indexRouter);
app.use('/lesson',lessonRouter);
app.use('/cargaMasiva',loadController);
app.use('/editor', editorRouter);


app.get('/getHeap',function(req,res){
       
     res.sendFile(__dirname +'/Heap.html');

});
app.get('/getStack',function(req,res){
       
     res.sendFile(__dirname +'/Stack.html');

});
app.get('/getSymbolTable',function(req,res){
       
     res.sendFile(__dirname +'/TablaSimbolos.html');

});
app.get('/getErrors',function(req,res){
       
     res.sendFile(__dirname +'/Errores.html');

});
app.get('/getTemps',function(req,res){
       
     res.sendFile(__dirname +'/temporales.html');

}); 
app.get('/getGeneratedCode',function(req,res){
       
     res.sendFile(__dirname +'/codigo3DGenerado.txt');

}); 
app.get('/getConsole',function(req,res){
       
     res.sendFile(__dirname +'/resultado.txt');

}); 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
