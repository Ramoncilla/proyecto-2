/*---- Expresion ----- */
var entero = require("../Arbol/Expresion/Entero");
var decimal = require("../Arbol/Expresion/Decimal");
var booleano = require("../Arbol/Expresion/Booleano");
var caracter = require("../Arbol/Expresion/Caracter");
var cadena = require("../Arbol/Expresion/Cadena");
var aritmerica = require("../Arbol/Expresion/Aritmetica");
var Relacional = require("../Arbol/Expresion/Relacional");
var Concatenar = require("../Arbol/Sentencias/Concatenar");
var Imprimir = require("../Arbol/Sentencias/Imprimir");
var  Romper= require("../Arbol/Sentencias/Romper");
var  Retorno = require("../Arbol/Sentencias/Retorno");
var  Continuar = require("../Arbol/Sentencias/Continuar");
var Asignacion = require("../Arbol/Sentencias/Asignacion");
/*

var  = require("../Arbol/Sentencias");
var  = require("../Arbol/Sentencias");
var  = require("../Arbol/Sentencias");
var  = require("../Arbol/Sentencias");
var  = require("../Arbol/Sentencias");
var  = require("../Arbol/Sentencias");
var  = require("../Arbol/Sentencias");


/*
SENTENCIA: DECLARACION{$$=$1;}
|CONCATENAR{$$=$1;}
|IMPRIMIR{$$=$1;}
|ROMPER{$$=$1;}
|RETORNO{$$=$1;}
|CONTINUAR{$$=$1;}
|ESTRUCTURA{$$=$1;}
|DECLA_LISTA{$$=$1;}
|DECLA_PILA{$$=$1;}
|DECLA_COLA{$$=$1;}
|SI{$$=$1;}
|SWITCH{$$=$1;}
|REPETIR_MIENTRAS{$$=$1;}
|HACER_MIENTRAS{$$=$1;}
|CICLO_X{$$=$1;}
|REPETIR{$$=$1;}
|REPETIR_CONTANDO{$$=$1;}
|ENCICLAR{$$=$1;}
|CONTADOR{$$=$1;}
|LEER_TECLADO{$$=$1;}
|ACCESO puntoComa{$$=$1;}
|ASIGNACION puntoComa{$$=$1;}
|DESTRUIR_PUNTERO puntoComa{$$=$1;}
|DECLA_PUNTERO puntoComa{$$=$1;};

*/
function sentenciaNombre(){

}






sentenciaNombre.prototype.obtenerNombreExpresion = function(sent){

    if(sent instanceof entero){
        return "ENTERO";
    }

    if(sent instanceof decimal){
        return "DECIMAL";
    } 

    if(sent instanceof booleano ){
        return "booleano";
    } 


    if(sent instanceof caracter){
        return "caracter";
    } 


    if(sent instanceof cadena){
        return "cadena";
    } 


    if(sent instanceof aritmerica){
        return "aritmetica";
    } 

    if(sent instanceof Relacional){
        return "relacional";
    }


    return "popis";


};



sentenciaNombre.prototype.obtenerNombreSentencia= function(sent){
  
   

 if(sent instanceof Asignacion){
     return "asignacion";
 }

/*
SENTENCIA: DECLARACION{$$=$1;}
|CONCATENAR{$$=$1;}
|IMPRIMIR{$$=$1;}
|ROMPER{$$=$1;}
|RETORNO{$$=$1;}
|CONTINUAR{$$=$1;}
|ESTRUCTURA{$$=$1;}
|DECLA_LISTA{$$=$1;}
|DECLA_PILA{$$=$1;}
|DECLA_COLA{$$=$1;}
|SI{$$=$1;}
|SWITCH{$$=$1;}
|REPETIR_MIENTRAS{$$=$1;}
|HACER_MIENTRAS{$$=$1;}
|CICLO_X{$$=$1;}
|REPETIR{$$=$1;}
|REPETIR_CONTANDO{$$=$1;}
|ENCICLAR{$$=$1;}
|CONTADOR{$$=$1;}
|LEER_TECLADO{$$=$1;}
|ACCESO puntoComa{$$=$1;}
|ASIGNACION puntoComa{$$=$1;}
|DESTRUIR_PUNTERO puntoComa{$$=$1;}
|DECLA_PUNTERO puntoComa{$$=$1;};

*/
return "hola";

};


module.exports = sentenciaNombre;