
var leccion = require("./Leccion");
var lErrores = require("../Errores/listaErrores");
var fs = require("fs");

function listaLecciones(){
    this.lecciones = [];
    this.cargarLecciones();
}

var errores = new lErrores();
listaLecciones.prototype.lecciones=[];




listaLecciones.prototype.existeLeccion = function(nombreLeccion, cadenaTipo){
    if(listaLecciones.prototype.lecciones == 0){
        return false;
    }else{
        var leccionTemporal;
        for(var i = 0; i<listaLecciones.prototype.lecciones.length; i++){
            leccionTemporal = listaLecciones.prototype.lecciones[i];
            if(leccionTemporal.titulo.toUpperCase() == nombreLeccion.toUpperCase() &&
                leccionTemporal.tipo.toUpperCase() == cadenaTipo.toUpperCase()){
                return true;
            }
        }
    }
    return false;
};

listaLecciones.prototype.saveLesson= function(leccion){
    if(!this.existeLeccion(leccion.titulo, leccion.tipo)){
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
    var cadena=JSON.stringify(listaLecciones.prototype.lecciones,null, '\t');
    var leccionTemporal;
    fs.writeFileSync('./lecciones.txt',cadena);
};


listaLecciones.prototype.getLessonType = function(type){
    var leccionTemporal;
    var listaHTML="";
    //<a href="#" class="list-group-item list-group-item-action">Dapibus ac facilisis in</a>
    for(var i =0; i<listaLecciones.prototype.lecciones.length; i++){
        leccionTemporal = listaLecciones.prototype.lecciones[i];
        if(type == 1 || type == 2){
            if(leccionTemporal.tipo == type){
                listaHTML+="<a href= \"#\" class = \"list-group-item \"> "+ leccionTemporal.titulo+" - Tipo "+leccionTemporal.tipo+"</a>";
            }
        }else{
            listaHTML+="<a href= \"#\" class = \"list-group-item \"> "+ leccionTemporal.titulo+" - Tipo "+leccionTemporal.tipo+"</a>";
        }
    }
    return listaHTML;
};

listaLecciones.prototype.cargarLecciones = function(){
     var cadenaLecciones = fs.readFileSync("./lecciones.txt");
     var arrayLecciones = JSON.parse(cadenaLecciones);
     var leccionTemporal;
     for(var i = 0; i<arrayLecciones.length; i++){
         leccionTemporal = arrayLecciones[i];
         this.saveLesson(leccionTemporal);
     }
};

module.exports= listaLecciones;