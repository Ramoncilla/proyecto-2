var Parametro = require("./Parametro");

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