var grammar = require("../Analizador/Lecciones/lecciones");
var listaErrores = require("../Analizador/Errores/listaErrores");
var lessonList = require("../Analizador/Lecciones/listaLecciones");

var errores= new listaErrores();

  
exports.load_file = function(req, res) {
    var cadenaArchivo = req.body.string_file;
    var a = grammar.parse(cadenaArchivo);
   
    var result;
    if(a instanceof lessonList){
      result = true;
    }else{
      result = false;
    }
    res.send(result);
};


