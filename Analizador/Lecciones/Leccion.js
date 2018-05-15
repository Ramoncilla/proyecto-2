var descripcionLeccion = require("./ArbolLecciones/descripcionLeccion");
var ejemploLeccion = require("./ArbolLecciones/ejemploLeccion");
var resultadoLeccion = require("./ArbolLecciones/resultadoLeccion");
var tareaLeccion = require("./ArbolLecciones/tareaLeccion");
var tipoLeccion = require("./ArbolLecciones/tipoLeccion");
var tituloLeccion = require("./ArbolLecciones/titulo");

function Leccion(){
    this.titulo="";
    this.descripcion="";
    this.tipo="";
    this.ejemplo = null;
    this.tarea="";
    this.resultado ="";
    this.tipoLeccion=0;

}



Leccion.prototype.insertarDescripcion = function (desc){
    this.descripcion = desc;
};

Leccion.prototype.insertarEjemplo = function(val){
    this.ejemplo = val;
};

Leccion.prototype.insertarResultado = function(val){
    this.resultado = val;
};

Leccion.prototype.insertarTarea = function(val){
    this.tarea = val;
};

Leccion.prototype.insertarTipo = function(val){
    this.tipo = val;
};

Leccion.prototype.insertarTitulo = function(val){
    this.titulo= val;
};

 
Leccion.prototype.insertarValor= function(valor){
    if(valor instanceof descripcionLeccion){
        this.descripcion = valor.descripcion;
    }

    if(valor instanceof ejemploLeccion){
        this.ejemplo = valor.ejemplo;
    }

    if(valor instanceof resultadoLeccion){
        this.resultado = valor.resultado;

    }

    if(valor instanceof tareaLeccion){
        this.tarea = valor.tarea;

    }
    
    if(valor instanceof tipoLeccion){

        this.tipo= valor.tipo;
        if(this.tipo.toUpperCase() == "A-COACH"){
            this.tipoLeccion = 1;

        }else{
            this.tipoLeccion=2;

        }
    }

    if(valor instanceof tituloLeccion){
        this.titulo = valor.nombreTitulo;
    }
};


module.exports = Leccion;