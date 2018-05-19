var Parametro = require("./Parametro");
var listaErrores= require("../../Errores/listaErrores");

var lErrores = new listaErrores();
function listaParametros(){
    this.parametros =[];
}
 
listaParametros.prototype.existeParametro=function(nuevo){
    var temporal;
    for(var i = 0; i<this.parametros.length; i++){
        temporal= this.parametros[i];
        if(temporal.getNombre().toUpperCase() == nuevo.getNombre().toUpperCase()){
            return true;
        }
    }

    return false;

};

listaParametros.prototype.insertarParametro= function(nuevoParametro){

    if(!(this.existeParametro(nuevoParametro))){
        this.parametros.push(nuevoParametro);
    }else{
        lErrores.insertarError("Semantica", "Ya existe un parametro con ese nombre");
    }
};


listaParametros.prototype.getParametros= function(){
    return this.parametros;
};


listaParametros.prototype.getCadenaParametros= function(){
    var temporal;
    var cadena="";
    for(var i =0; i<this.parametros.length; i++){
        temporal = this.parametros[i];
        if(i==(this.parametros.length-1)){
            cadena +=temporal.getTipo();
        }else{
            cadena+=temporal.getTipo()+"_";
        }
    }
    return cadena;
};

module.exports= listaParametros;