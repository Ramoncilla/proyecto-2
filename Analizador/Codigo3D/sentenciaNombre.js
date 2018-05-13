/*---- Expresion ----- */
var entero = require("../Arbol/Expresion/Entero");
var decimal = require("../Arbol/Expresion/Decimal");
var booleano = require("../Arbol/Expresion/Booleano");
var caracter = require("../Arbol/Expresion/Caracter");
var cadena = require("../Arbol/Expresion/Cadena");
var aritmerica = require("../Arbol/Expresion/Aritmetica");
var Relacional = require("../Arbol/Expresion/Relacional");


var declaArreglo = require("../Arbol/Sentencias/DeclaArreglo");
var Concatenar = require("../Arbol/Sentencias/Concatenar");
var Imprimir = require("../Arbol/Sentencias/Imprimir");
var  Romper= require("../Arbol/Sentencias/Romper");
var  Retorno = require("../Arbol/Sentencias/Retorno");
var  Continuar = require("../Arbol/Sentencias/Continuar");
var Asignacion = require("../Arbol/Sentencias/Asignacion");
var asignaDecla = require("../Arbol/Sentencias/AsignaDecla");
var asignaArreglo = require("../Arbol/Sentencias/AsignacionArreglo");
var repetir_mientras = require("../Arbol/Sentencias/Repetir_Mientras");
var decla_puntero = require("../Arbol/Sentencias/DeclaPuntero");
var decla_asigna_puntero = require("../Arbol/Sentencias/DeclaAsignaPuntero");
var hacer_mientras = require("../Arbol/Sentencias/Hacer_Mientras");
var repetir = require("../Arbol/Sentencias/Repetir");
var enciclar = require("../Arbol/Sentencias/Enciclar");
var si = require("../Arbol/Sentencias/Si");
var contador = require("../Arbol/Sentencias/Contador");
var repetirContado = require("../Arbol/Sentencias/Repetir_Contando");
var ciclox = require("../Arbol/Sentencias/Ciclo_X");
var selecciona = require("../Arbol/Sentencias/Selecciona");


var decla_lista = require("../Arbol/Sentencias/DeclaLista");
var decla_cola = require("../Arbol/Sentencias/DeclaCola");
var decla_pila = require("../Arbol/Sentencias/DeclaPila");




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
var Identificador = require("../Arbol/Expresion/t_id");



var expresion3D = require("../Interprete/ArbolInterprete/Aritmetica");
var get_asig_ed_3d = require("../Interprete/ArbolInterprete/Get_Asig_ED");
var asig_3d = require("../Interprete/ArbolInterprete/Asig");
var llamada_3d = require("../Interprete/ArbolInterprete/Llamada");
var imprimir_3d = require("../Interprete/ArbolInterprete/Imprimir");
var relacional_3d = require("../Interprete/ArbolInterprete/Relacional");
var etiqueta_3d = require("../Interprete/ArbolInterprete/Etiqueta");
var salto_3d = require("../Interprete/ArbolInterprete/Salto");

function sentenciaNombre(){

}

sentenciaNombre.prototype.obtenerNombre3D= function(sent){

    if(sent instanceof expresion3D){
        return "aritmetica";
    }

    if(sent instanceof get_asig_ed_3d){
        return "get_asig_ed_3d";
    }

    if(sent instanceof asig_3d){
        return "asig_3d";
    }

    if(sent instanceof llamada_3d){
        return "llamada";
    }

    if(sent instanceof imprimir_3d){
        return "imprimir";
    }

    if(sent instanceof relacional_3d){
        return "relacional";
    }

    if(sent instanceof etiqueta_3d){
        return "etiqueta";
    }

    if(sent instanceof salto_3d){
        return "salto";
    }

    return "";
};




sentenciaNombre.prototype.obtenerNombreExpresion = function(sent){

     

    if(sent instanceof obtenerDireccion){
        return "obtenerDireccion";
    }

    if(sent instanceof obtenerTamanio){
        return "obtenerTamanio";
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

   
    if(sent instanceof llamada){
        return "LLAMADA";
    }
    

    if(sent instanceof Negativo){
        return "negativo";
    }

    if(sent instanceof notLogica){
        return "NOT_LOGICA";
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




    if(sent instanceof cadena){
        return "cadena";
    }


    if(sent instanceof posArreglo){
        return "pos_Arreglo";
    }

    if(sent instanceof nulo){
        return "nulo2";
    }

    if(sent instanceof Identificador){
        return "identificador";
    }

    if(sent instanceof Logica){
        return "logica";
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

    if(sent instanceof aritmerica){
        return "aritmetica";
    } 

    if(sent instanceof Relacional){
        return "relacional";
    }


    


};
 


sentenciaNombre.prototype.obtenerNombreSentencia= function(sent){

    if(sent instanceof selecciona){
        return "SELECCIONA";
    }

    if(sent instanceof ciclox){
        return "DOBLE_CONDICION";
    }

if(sent instanceof repetirContado){
    return "REPETIR_CONTANDO";
}

    if(sent instanceof contador){
        return "CONTADOR";
    }

    if(sent instanceof si){
        return "SI";
    }

    if(sent instanceof enciclar){
        return "ENCICLAR";
    }

    if(sent instanceof Romper){
        return "ROMPER";
    }

    if(sent instanceof Continuar){
        return "CONTINUAR";
    }

    if(sent instanceof repetir){
        return "repetir";
    }

    if(sent instanceof hacer_mientras){
        return "HACER_MIENTRAS";
    }
    if (sent instanceof Retorno){
        return "RETORNO";
    }

    if(sent instanceof llamada){
        return "LLAMADA";
    }

    if(sent instanceof Concatenar){
        return "CONCATENAR";
    }

    if(sent instanceof decla_puntero){
        return "DECLA_PUNTERO";
    }

   if(sent instanceof decla_asigna_puntero){
       return "DECLA_ASIGNA_PUNTERO";
   }  

   if(sent instanceof Acceso){
       return "ACCESO";
   }

if(sent instanceof decla_lista){
    return "DECLA_LISTA";
}

if(sent instanceof decla_cola){
    return "DECLA_COLA";
}

if(sent instanceof decla_pila){
    return "DECLA_PILA";
}


  if(sent instanceof repetir_mientras){
        return "REPETIR_MIENTRAS";
    }
   

 if(sent instanceof Asignacion){
     return "asignacion";
 }

 if (sent instanceof Imprimir){
     return "imprimir";
 }


 if(sent instanceof declaArreglo){
     return "decla_Arreglo";
 }


 if(sent instanceof asignaDecla){
     return "asigna_Decla";
 }


 if(sent instanceof asignaArreglo){
     return "ASIGNACION_ARREGLO";
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