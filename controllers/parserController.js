var grammar = require("../Analizador/gramatica");
var parseFile = require("../Analizador/Arbol/Archivo");
var class_ = require("../Analizador/Arbol/Clase");
var import_ = require("../Analizador/Arbol/Sentencias/Importar");
var listaErrores = require("../Analizador/Errores/listaErrores");
var errores= new listaErrores();
var listaClase=[];
 
exports.parse_string = function(req, res) {
    listaClase=[];
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
    res.send(cadenaTabla);
};


function agregarHerenciaClases(){
  var claseTemporal;
  var atributosHeredados=[];
  var funcionesHeredadas=[];
  for(var i=0; i<listaClase.length;i++){
    claseTemporal= listaClase[i];
    if(claseTemporal.herencia !=""){
      var clasePadre = obtenerClasePadre(claseTemporal.herencia);
      if(clasePadre!=null){
        console.log("si existe la clase padre");
        atributosHeredados= clasePadre.obtenerAtributosValidosHerencia();
        funcionesHeredadas= clasePadre.obtenerFuncionesValidasHerencia();
       
        //insertando atributos 
        for(var j =0; j<atributosHeredados.length;j++){
          listaClase[i].insertarAtributoHeredado(atributosHeredados[j]);
        }

        //insertando funciones 
        for(var j =0; j<funcionesHeredadas.length;j++){
          listaClase[i].insertarFuncionHeredada(funcionesHeredadas[j]);
        }

      }
      console.log(claseTemporal.nombre +", posee herencia de "+ claseTemporal.herencia);
    }else{
      console.log(claseTemporal.nombre+", no posee herencia");
    }
  }
}


function obtenerClasePadre(nombre){
  var claseTemporal;
  for(var i=0; i<listaClase.length;i++){
    claseTemporal = listaClase[i];
    if(claseTemporal.nombre.toUpperCase() == nombre.toUpperCase()){
      return claseTemporal;
    }
  }
  errores.insertarError("Semantico","No existe la clase "+ nombre);
  console.log("no existe la clase "+nombre+" hrencia");
  return null;
}


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
    agregarHerenciaClases();
    var claseTemporal;
    var simbolosClase = [];
    var simbolosClase2=[];
    for (var i = 0; i < listaClase.length; i++) {
      claseTemporal = listaClase[i];
      simbolosClase2=claseTemporal.generarSimbolosClase();
      for(var j = 0; j<simbolosClase2.length;j++){
        simbolosClase.push(simbolosClase2[j]);
      }

      
    }
    console.log("Tamanho de simbolos en clase  "+ simbolosClase.length); 
    var encabezado="<table border =1><tr>"
    +"<th>Nombre</th>"
              +"<th> Ambito</th>"
              +"<th>Tipo Simbolo </th>"
              +"<th> Rol </th>"
              +"<th>Visibilidad</th>"
              
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