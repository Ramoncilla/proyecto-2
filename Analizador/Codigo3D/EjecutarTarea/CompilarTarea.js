

var gramaticaClases = require("../../gramatica");
var gramaticaExpresion = require("../../gramFuncion");
var expRel = require("../../Arbol/Expresion/Relacional");
var ambitosD = require("../../Codigo3D/Ambito");


function ejecutarTarea(){

    this.cadenaTarea ="";    
}


ejecutarTarea.prototype.analizar = function (cadena, tarea){


  var a = gramaticaClases.parse(cadena);
  var cadena3D = "Hubo un error";
  if(a instanceof parseFile)
  {
    var generador3D = new generacionCodigo();
    generador3D.setValores(a);
    generador3D.generar3D(function(cadena3D){
       res.send(cadena3D);
    });

  var valoresLlamada = tarea.split("=");
  var exp1 = gramaticaExpresion.parse(tarea[0]);
  var exp2 = gramaticaExpresion.parse(taarea[1])
  if(exp1!= null && exp2!=null){
      var g = new generacionCodigo();
      var expNueva = new expRel();
      var ambito = new ambitosD();
      expNueva.setValores(exp1, exp2, "==");
      var v = g.resolverExpresion(expNueva, ambito, "CLASE", "FUNC");
      var cadenaRes = ""


  }

    
  }
  else{
    errores.insertarError("Semantico","Ha ocurrido algun error en la generacion del arbol, revisar sintaxis");
  }
 


};




module.exports = ejecutarTarea;



