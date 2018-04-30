
var leccion = require("./Leccion");
var lErrores = require("../Errores/listaErrores");
var fs = require("fs");

function listaLecciones(){
    this.lecciones = [];
}

var errores = new lErrores();
listaLecciones.prototype.lecciones=[];

listaLecciones.prototype.existeLeccion = function(nombreLeccion){
    if(listaLecciones.prototype.lecciones == 0){
        return false;
    }else{
        var leccionTemporal;
        for(var i = 0; i<listaLecciones.prototype.lecciones.length; i++){
            leccionTemporal = listaLecciones.prototype.lecciones[i];
            if(leccionTemporal.titulo.toUpperCase() == nombreLeccion.toUpperCase()){
                return true;
            }
        }
    }
    return false;
};


listaLecciones.prototype.saveLesson= function(leccion){
    if(!this.existeLeccion(leccion.titulo)){
        listaLecciones.prototype.lecciones.push(leccion);
        this.writeLesson();
        console.log("La leccion "+ leccion.titulo+", ha sido guardada exitosamente");
        return true;
    }else{
        errores.insertarError("Semantico", "La leccion "+leccion.titulo+", no se ha podido guardar, ya existe");
        return false;
    }
};

listaLecciones.prototype.writeLesson= function(){
    var cadena="";
    var leccionTemporal;
    for(var i=0; i<listaLecciones.prototype.lecciones.length; i++){
        leccionTemporal= listaLecciones.prototype.lecciones[i];
        cadena+=leccionTemporal.cadenaLeccion();
    }
    fs.writeFileSync('./lecciones.txt',cadena);
};



module.exports= listaLecciones;