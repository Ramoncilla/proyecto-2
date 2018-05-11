var listaErrores= require("../Errores/listaErrores");
var lErrores = new listaErrores();
var Funcion = require("./Funciones/Funcion");

function listaFunciones(){
    this.funciones =[];
}

listaFunciones.prototype.existeFuncion = function(nuevaFunc){
    var firmaNueva = nuevaFunc.obtenerFirma();
    var temporalFunc, temporalFirma;  
    if(nuevaFunc.esConstructor){
        if(nuevaFunc.nombreFuncion.toUpperCase() == nuevaFunc.nombreClase.toUpperCase()){
            for(var i=0; i<this.funciones.length;i++){
                temporalFunc= this.funciones[i];
                temporalFirma= temporalFunc.obtenerFirma();
                if(temporalFirma.toUpperCase() == firmaNueva.toUpperCase()){
                    return true;
                }
            }

        }else{
            lErrores.insertarError("Semantico","Constructor no valido, "+ nuevaFunc.nombreFuncion+", debe llamarse "+ nuevaFunc.nombreClase);
            //console.log("constructor no valido ");
            return true;
        }

    }else{
        for(var i=0; i<this.funciones.length;i++){
            temporalFunc= this.funciones[i];
            temporalFirma= temporalFunc.obtenerFirma();
            if(temporalFirma.toUpperCase() == firmaNueva.toUpperCase()){
                return true;
            }
        }
        return false;

    }
};

listaFunciones.prototype.insertarFuncion = function(nuevaFunc){

    if(!this.existeFuncion(nuevaFunc)){
        this.funciones.push(nuevaFunc);
        //console.log("se ha guardado la funcion " + nuevaFunc.obtenerFirma());
    }else{
        lErrores.insertarError("Semantico","Ha ocurrido un error, no se ha podido guardar la funcion  "+nuevaFunc.nombreFuncion);
       // console.log("Error, la funcion con el nombre ya existe o ya fue sobreescrita "+ nuevaFunc.obtenerFirma());
    } 
   


};

listaFunciones.prototype.insertarFuncionHeredada= function(func, clase){
    var nueva= new Funcion();
    var vis= func.visibilidad;
    var tipo = func.tipo;
    var sobreEscrita= func.sobreEscrita;
    var nombreF= func.nombreFuncion;
    var parametros = func.parametrosArre;
    var esConst= func.esConstructor;
    var sent = func.sentencias;
    nueva.setValores(vis,tipo,nombreF,parametros,sent);
    nueva.setNombreClase(clase);
    this.insertarFuncion(nueva);
};


listaFunciones.prototype.obtenerFuncionesPublicas= function(){
    var retorno =[];
    var funTemporal;
    for(var i =0; i<this.funciones.length; i++){
        funTemporal = this.funciones[i];
        if(funTemporal.visibilidad.toUpperCase() == "PUBLICO" &&
            (!funTemporal.esConstructor)){
            retorno.push(funTemporal);
        }
    }
    return retorno;
};

module.exports= listaFunciones;