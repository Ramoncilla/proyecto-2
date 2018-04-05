/*---- Expresion ----- */
var entero = require("../Arbol/Expresion/Entero");
var decimal = require("../Arbol/Expresion/Decimal");
var booleano = require("../Arbol/Expresion/Booleano");
var caracter = require("../Arbol/Expresion/Caracter");
var cadena = require("../Arbol/Expresion/Cadena");
var aritmerica = require("../Arbol/Expresion/Aritmetica");
var Relacional = require("../Arbol/Expresion/Relacional");




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



};

module.exports = sentenciaNombre;