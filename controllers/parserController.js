var grammar = require("../Analizador/gramatica");
var parseFile = require("../Analizador/Arbol/Archivo");
var listaClase=[];
 
exports.parse_string = function(req, res) {
    var a = req.body.string_file;
    console.log(a);
   //console.dir(req);
    res.send("holaaa ");
    //var a = grammar.parse(req.string);
    /*if(a instanceof Archivo)
    {
    	var sentenciasArchivo = a.getSentencias();
    	console.log("Sentencias en el archivo " + sentenciasArchivo.length);
      var importaciones =[];
      
      for (var i = 0; i < sentenciasArchivo.length; i++) {
        var temporal= sentenciasArchivo[i];
        if(temporal instanceof Clase){
          listaClase.push(temporal);
        }
        if(temporal instanceof Importar){
          importaciones.push(temporal);
        }

      }
      
      generarImportaciones(importaciones);
      generarSimbolosClase();



      
    }*/
    //res.send('NOT IMPLEMENTED: Author list');


};


function generarImportaciones(listaImport){
    var nombreTemporal;
    for (var i = 0; i < listaImport.length; i++) {
      nombreTemporal= listaImport[i];
      console.log("importando " + nombreTemporal);
    }
  
  }
  
  function generarSimbolosClase(){
    var claseTemporal;
    var simbolosClase = [];
    for (var i = 0; i < listaClase.length; i++) {
      claseTemporal = listaClase[i];
      simbolosClase=claseTemporal.generarSimbolosAtributos();
      console.log("Tamanio  Atributos "+ simbolosClase.length); 
    }
  
    var encabezado="<tr>"
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
              +"</tr>";
     var cuerpo ="";
    var temporal;          
    for (var i = 0; i < simbolosClase.length; i++) {
      temporal = simbolosClase[i];
      cuerpo +=temporal.getHTMLSimbolo();
    }
  }  