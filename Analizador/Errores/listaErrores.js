var Error = require("./Error");


function listaErrores(){
    this.errores =[];
}

listaErrores.prototype.errores=[];


listaErrores.prototype.insertarError= function(tipo, desc){
    var nuevoError = new Error();
    nuevoError.setValores(tipo,desc);
    listaErrores.prototype.errores.push(nuevoError);
};

listaErrores.prototype.obtenerLista= function(){
    return listaErrores.prototype.errores;
};

module.exports = listaErrores;