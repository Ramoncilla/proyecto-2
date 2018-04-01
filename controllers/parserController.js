var grammar = require("../Analizador/gramatica");
var parseFile = require("../Analizador/Arbol/Archivo");
var class_ = require("../Analizador/Arbol/Clase");
var import_ = require("../Analizador/Arbol/Sentencias/Importar");
var listaClase=[];
 
exports.parse_string = function(req, res) {
    var cadenaArchivo = req.body.string_file;
    var a = grammar.parse(cadenaArchivo);
    var cadenaTabla="";
    var stringImport="";
    if(a instanceof parseFile)
    {
    	var sentenciasArchivo = a.getSentencias();
    	console.log("Sentencias en el archivo " + sentenciasArchivo.length);
      var importaciones =[];
      for (var i = 0; i < sentenciasArchivo.length; i++) {
        var temporal= sentenciasArchivo[i];
        if(temporal instanceof class_){
          listaClase.push(temporal);
        }
        if(temporal instanceof import_){
          importaciones.push(temporal);
        }

      }
      
      stringImport = generarImportaciones(importaciones);
      cadenaTabla = generarSimbolosClase();
      
    }
    //console.log(stringImport);
    //console.log(cadenaTabla);
    res.send(cadenaTabla);
};


function generarImportaciones(listaImport){
    var nombreTemporal;
    var nameImport="";
    for (var i = 0; i < listaImport.length; i++) {
      nombreTemporal= listaImport[i];
      nameImport+=nombreTemporal+"\n";
      console.log("importando " + nombreTemporal);
    }
  
    return nameImport;
  }
  
  
  function generarSimbolosClase(){
    var claseTemporal;
    var simbolosClase = [];
    for (var i = 0; i < listaClase.length; i++) {
      claseTemporal = listaClase[i];
      simbolosClase=claseTemporal.generarSimbolosClase();
      console.log("Tamanho de simbolos en clase  "+ simbolosClase.length); 
    }
  
    var encabezado="<table border =1><tr>"
              +"<th> Ambito</th>"
              +"<th>Tipo Simbolo </th>"
              +"<th> Rol </th>"
              +"<th>Visibilidad</th>"
              +"<th>Nombre</th>"
              +"<th>Tipo Elemento </th>"
              +"<th> Apuntador</th>"
              +"<th> Tamanio </th>"
              +"<th> No. Parametros</th>"
              +"<th> Cadena Parametros </th>"
              +"<th> Nombre Funcion </th>"
              +"<th> No. Dimensiones </th>"
              +"<th> Paso de referencia </th>"
              +"</tr>";
     var cuerpo ="";
    var temporal;          
    for (var i = 0; i < simbolosClase.length; i++) {
      temporal = simbolosClase[i];
      cuerpo +=temporal.getHTMLSimbolo();
    }
    var tabla =encabezado + cuerpo+"</table>";
    return tabla;
  }  