var lessonList = require("../Analizador/Lecciones/listaLecciones");
var lesson = require("../Analizador/Lecciones/Leccion");
var compilarTarea = require("../Analizador/Codigo3D/EjecutarTarea/CompilarTarea");
var listLesson = new lessonList();

exports.createLesson = function(req, res) {

    console.log("Crear una nueva leccion");
    listLesson.cargarLecciones();
    var newLesson = new lesson();
    var tipo ="g-coach"; 
    var g = req.body.typeLesson;
    if(g  == "1"){
        tipo="a-coach";
    } 
    newLesson.titulo= req.body.lessonTitle;
    newLesson.descripcion = req.body.lessonExplanation;
    newLesson.ejemplo= req.body.codeExample;
    newLesson.tarea= req.body.homeworkStatement;
    newLesson.resultado= req.body.homeworkTest;
    newLesson.tipo = tipo;
    newLesson.tipoLeccion = g;
    var result = listLesson.saveLesson(newLesson);
    res.send(result);
};



exports.mostrarLecciones = function(req, res){

    listLesson.cargarLecciones();

    var lecciones = listLesson.getLessonType(0);


    res.send(lecciones);
};

exports.getLesson = function(req, res){

    var title = req.query.title;

    var lesson = listLesson.getLesson(title);
    
    res.render('lesson', lesson);

};

exports.takeLesson = function(req, res){

    var code = req.body.code;
    var result = req.body.result;

    console.log(result);
    console.log(code);
    /*var comp = new compilarTarea();
    comp.analizar(code, result);*/

    res.send("ok");

}