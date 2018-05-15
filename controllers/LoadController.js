var grammar = require("../Analizador/Lecciones/lecciones");
var parseFile = require("../Analizador/Arbol/Archivo");
var generacionCodigo = require("../Analizador/Codigo3D/generacionCodigo");
var listaErrores = require("../Analizador/Errores/listaErrores");
var errores= new listaErrores();

  
exports.load_file = function(req, res) {
    var cadenaArchivo = req.body.string_file;
    var a = grammar.parse(cadenaArchivo);
    console.dir(a);

    /*
    
    var cadena3D = "Hubo un error";
    if(a instanceof parseFile)
    {
      var generador3D = new generacionCodigo();
      generador3D.setValores(a);
      cadena3D= generador3D.generar3D();
    }
    else{
      errores.insertarError("Semantico","Ha ocurrido algun error en la generacion del arbol, revisar sintaxis");
    }
    */
    res.send(cadenaArchivo);
};


