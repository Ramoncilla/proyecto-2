
var leccion = require("./Leccion");
var lErrores = require("../Errores/listaErrores");
var fs = require("fs");

function listaLecciones(){
    this.lecciones = [];
    //this.cargarLecciones();
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
   
    for(var i =0; i<listaLecciones.prototype.lecciones.length; i++){
        leccionTemporal = listaLecciones.prototype.lecciones[i];
        if(type == 1 || type == 2){
            if(leccionTemporal.tipo == type){

                var urlEncoded = "/lesson/get?title=";
                urlEncoded += encodeURIComponent(leccionTemporal.titulo);

                listaHTML+="<a href= \""+urlEncoded+"\" data-name = \""+ leccionTemporal.titulo +"\" class = \"list-group-item list-group-item-action lesson-item\"> "+ leccionTemporal.titulo+" - Tipo "+leccionTemporal.tipo+"</a>";
            }
        }else{

            var urlEncoded = "/lesson/get?title=";
            urlEncoded += encodeURIComponent(leccionTemporal.titulo);
            listaHTML+="<a href= \""+urlEncoded+"\" data-name = \""+ leccionTemporal.titulo +"\" class = \"list-group-item list-group-item-action lesson-item\"> "+ leccionTemporal.titulo+" - Tipo "+leccionTemporal.tipo+"</a>";
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

listaLecciones.prototype.getLesson = function(title){
    
    var stringLessons = fs.readFileSync("./lecciones.txt");
    var array = JSON.parse(stringLessons);
    
    for(var i = 0; i<array.length; i++){

        if(array[i].titulo === title ){
            return array[i];
        }
    }
    return undefined;
     

};


listaLecciones.prototype.getLessonsByTitle = function(needle, type){
    var leccionTemporal;
    var listaHTML="";

    type = parseInt(type);
    for(var i =0; i<listaLecciones.prototype.lecciones.length; i++){
        leccionTemporal = listaLecciones.prototype.lecciones[i];
        if(type == 1 || type == 2){
            if(parseInt(leccionTemporal.tipo) === type){
                
                var re = new RegExp(needle,"g");
                if(leccionTemporal.titulo.toLowerCase().search(needle.toLowerCase()) >= 0){
                    var urlEncoded = "/lesson/get?title=";
                    urlEncoded += encodeURIComponent(leccionTemporal.titulo);

                    listaHTML+="<a href= \""+urlEncoded+"\" data-name = \""+ leccionTemporal.titulo +"\" class = \"list-group-item list-group-item-action lesson-item\"> "+ leccionTemporal.titulo+" - Tipo "+leccionTemporal.tipo+"</a>";
                }

            }
        }else{

            var re = new RegExp(needle,"g");
            if(leccionTemporal.titulo.toLowerCase().search(needle.toLowerCase()) >= 0){

                var urlEncoded = "/lesson/get?title=";
                urlEncoded += encodeURIComponent(leccionTemporal.titulo);
                listaHTML+="<a href= \""+urlEncoded+"\" data-name = \""+ leccionTemporal.titulo +"\" class = \"list-group-item list-group-item-action lesson-item\"> "+ leccionTemporal.titulo+" - Tipo "+leccionTemporal.tipo+"</a>";

            }
            
        }
    }
    return listaHTML; 
};
module.exports= listaLecciones;