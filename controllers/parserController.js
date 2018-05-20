var grammar = require("../Analizador/gramatica");
var parseFile = require("../Analizador/Arbol/Archivo");
var generacionCodigo = require("../Analizador/Codigo3D/generacionCodigo");
var listaErrores = require("../Analizador/Errores/listaErrores");
var errores= new listaErrores();

 
exports.parse_string = function(req, res) {
    var cadenaArchivo = req.body.string_file;
    var a = grammar.parse(cadenaArchivo);
    var cadena3D = "Hubo un error";
    if(a instanceof parseFile)
    {
      var generador3D = new generacionCodigo();
      generador3D.setValores(a);
      generador3D.generar3D(function(cadena3D){
         res.send(cadena3D);
      });
    }
    else{
      errores.insertarError("Semantico","Ha ocurrido algun error en la generacion del arbol, revisar sintaxis");
    }
   
};


