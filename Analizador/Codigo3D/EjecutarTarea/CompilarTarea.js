
var fs = require("fs");
var grammarFile = require("../../gramatica");
var gramaticaExpresion = require("../../gramFuncion");
var expRel = require("../../Arbol/Expresion/Relacional");
var ambitosD = require("../../Codigo3D/Ambito");
var parseFile = require("../../Arbol/Archivo");
var generacionCodigo = require("../generacionCodigo");
var func = require("../../Arbol/Funciones/Funcion");
var nodoSi = require("../../Arbol/Sentencias/Si");
var nodoImprimir = require("../../Arbol/Sentencias/Imprimir");
var nodoEntero = require("../../Arbol/Expresion/Entero");
var nodoPrincipal = require("../../Arbol/Funciones/Principal");


function ejecutarTarea(){

    this.cadenaTarea ="";    
}


ejecutarTarea.prototype.analizar = function (cadena, tarea){


  
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
      var imprimirV = new nodoImprimir();
      var imprimirF = new nodoImprimir();
      var enteroV = new nodoEntero();
      enteroV.valorEntero= 123456789;
      var enteroF = new nodoEntero();
      enteroF.valorEntero=252525;
      imprimirV.expresionImprimir = enteroV;
      imprimirF.expresionImprimir = enteroF;
      var ifN = new nodoSi();
      ifN.expresion = expNueva;
      ifN.sentV.push(imprimirV);
      ifN.sentF.push(imprimirF);
      var princ = new nodoPrincipal();
      princ.sentencias.push(ifN);


      var a = grammarFile.parse(cadena);
      var cadena3D = "Hubo un error";
      var generador3D = new generacionCodigo();
      if(a instanceof parseFile)
      {
         a.sentencias[0].principal_met= princ;
        generador3D.setValores(a);
        generador3D.generar3D(function(cadena3D){
           //res.send(cadena3D);
        });
        var cad = fs.readFileSync("./resultado.txt",'utf8');
        console.log("Resultados: "+ cad);
        var pos = cad.indexOf("123456789");
        if(pos!=-1){
          return true;
        }else{
          return false;
        }



      }
      else{
        errores.insertarError("Semantico","Ha ocurrido algun error en la generacion del arbol, revisar sintaxis");
      }
      codigo +=generador3D.c3d.getCodigo3D();
      console.log(codigo);

  }

return false;

};




module.exports = ejecutarTarea;



