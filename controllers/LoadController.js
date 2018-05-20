var grammar = require("../Analizador/Lecciones/lecciones");
var listaErrores = require("../Analizador/Errores/listaErrores");
var lessonList = require("../Analizador/Lecciones/listaLecciones");

var errores= new listaErrores();

  
exports.load_file = function(req, res) {
    var cadenaArchivo = req.body.string_file;
    var lecciones  = grammar.parse(cadenaArchivo);
    var listaLecciones = new lessonList();
    if(lecciones!=0){
      var leccionTemporal; 
      for(var i =0; i<lecciones.length; i++){
        leccionTemporal = lecciones[i];
        listaLecciones.saveLesson(leccionTemporal);
      }
    }
    var bandera = lecciones!=0;
    res.send(bandera);
};


