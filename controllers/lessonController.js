var lessonList = require("../Analizador/Lecciones/listaLecciones");
var lesson = require("../Analizador/Lecciones/Leccion");
 

exports.createLesson = function(req, res) {

    console.log("Crear una nueva leccion");
    /*
    var listLesson = new lessonList();
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
    var result = listLesson.saveLesson(newLesson);*/
    res.send("Crear na nueva leccion");
};



