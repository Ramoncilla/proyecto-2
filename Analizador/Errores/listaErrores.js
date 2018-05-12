var Error = require("./Error");
var salto ="\n";

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

listaErrores.prototype.obtenerErroresHTML = function(){
    var tabla= "<table border =1><tr>"
                    +"<th> Tipo de Error </th>"
                    +"<th> Descripcion </th>"
                    +"<th> Columna </th>"
                    +"<th> Fila </th>"
                    +"</tr>";

    var errorTemporal;
    for(var i =0; i< listaErrores.prototype.errores.length; i++){
        errorTemporal = listaErrores.prototype.errores[i];
        tabla +=errorTemporal.getHTML();
    }
    tabla +="</table>";



return tabla;
};

listaErrores.prototype.reiniciar= function(){
    listaErrores.prototype.errores =[];
};

module.exports = listaErrores;