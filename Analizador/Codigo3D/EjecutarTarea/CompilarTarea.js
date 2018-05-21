

var grammarFile = require("../../gramatica");
var gramaticaExpresion = require("../../gramFuncion");
var expRel = require("../../Arbol/Expresion/Relacional");
var ambitosD = require("../../Codigo3D/Ambito");
var parseFile = require("../../Arbol/Archivo");
var generacionCodigo = require("../generacionCodigo");


function ejecutarTarea(){

    this.cadenaTarea ="";    
}


ejecutarTarea.prototype.analizar = function (cadena, tarea){


  var a = grammarFile.parse(cadena);
  var cadena3D = "Hubo un error";
  var generador3D = new generacionCodigo();
  if(a instanceof parseFile)
  {
    //var generador3D = new generacionCodigo();
    generador3D.setValores(a);
    generador3D.generar3D(function(cadena3D){
       //res.send(cadena3D);
    });

    console.log(generador3D.c3d.getCodigo3D());
    console.log(cadena);
    console.log(tarea);

    
  var valoresLlamada = tarea.split("=");
  console.log(valoresLlamada[0]);
  console.log(valoresLlamada[1]);
  
  var exp1 = gramaticaExpresion.parse(valoresLlamada[0]);
  var exp2 = gramaticaExpresion.parse(valoresLlamada[1])
  var codigo ="";
  
  if(exp1!= null && exp2!=null){
      var g = new generacionCodigo();
      var expNueva = new expRel();
      var ambito = new ambitosD();
      expNueva.setValores(exp1, exp2, "==");
      var nodo1 = g.resolverExpresion(expNueva, ambito, "CLASE", "FUNC");
      var cadenaRes = "begin, , , comprobar \n";
      cadenaRes+=g.c3d.getCodigo3D();
      cadenaRes= nodo1.getCodigo() + "\n" +
										nodo1.getEtiquetasVerdaderas() + "\n print(\"%d\", 123456);"+
										nodo1.getEtiquetasFalsas()+"\n print(\"%d\", 25252525);";
      cadenaRes+="end, , , comprobar";
      codigo +=generador3D.c3d.getCodigo3D()+ cadenaRes;
console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      console.log(codigo);

  }

   
  }
  else{
    errores.insertarError("Semantico","Ha ocurrido algun error en la generacion del arbol, revisar sintaxis");
  }
 
};




module.exports = ejecutarTarea;



