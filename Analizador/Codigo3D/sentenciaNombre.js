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



var Acceso = require("../Arbol/Expresion/Acceso");
var convertirCadena = require("../Arbol/Expresion/convertirCadena");
var convertirEntero = require("../Arbol/Expresion/convertirEntero");
var Este = require("../Arbol/Expresion/Este");
var funNativa = require("../Arbol/Expresion/FuncionNativa");
var Instancia = require("../Arbol/Expresion/Instancia");
var llamada = require("../Arbol/Expresion/Llamada");
var Logica = require("../Arbol/Expresion/Logica");
var Negativo = require("../Arbol/Expresion/Negativo");
var notLogica = require("../Arbol/Expresion/Not_logica");
var nulo = require("../Arbol/Expresion/Nulo");
var obtenerDireccion = require("../Arbol/Expresion/obtenerDireccion");
var obtenerTamanio = require("../Arbol/Expresion/ObtenerTamanio");
var posArreglo = require("../Arbol/Expresion/PosArreglo");
var ReservarMemoria = require("../Arbol/Expresion/ReservarMemoria");
var unario = require("../Arbol/Expresion/Unario");
var valorPuntero = require("../Arbol/Expresion/ValorPuntero");

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

   


    if(sent instanceof obtenerDireccion){
        return "obtenerDireccion";
    }

    if(sent instanceof obtenerTamanio){
        return "obtenerTamanio";
    }

    if(sent instanceof posArreglo){
        return "posArreglo";
    }

    if(sent instanceof ReservarMemoria){
        return "reservarMemoria";
    }

    if(sent instanceof unario){
        return "unario";
    }

    if(sent instanceof valorPuntero){
        return "valorPuntero";
    }

    if(sent instanceof Instancia){
        return "instancia";
    }

    if(sent instanceof llamada){
        return "llamada";
    }
    if(sent instanceof Logica){
        return "logica";
    }

    if(sent instanceof Negativo){
        return "negativo";
    }

    if(sent instanceof notLogica){
        return "notLogica";
    }

    if(sent instanceof nulo){
        return "nulo";
    }

    if(sent instanceof convertirEntero){
        return "convertirEntero";
    }

    if(sent instanceof Este){
        return "este";
    }

    if(sent instanceof funNativa){
        return "funNativa";
    }


    if(sent instanceof Acceso){
        return "acceso";
    }

    if(sent instanceof convertirCadena){
        return "convertirCadena";
    }



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