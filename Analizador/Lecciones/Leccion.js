function Leccion(){
    this.titulo="";
    this.descripcion="";
    this.tipo="";
    this.ejemplo = "";
    this.tarea="";
    this.resultado ="";
    this.tipoLeccion=2;

}

Leccion.prototype.cadenaLeccion = function(){
    var result = "{%\n"
        +"titulo { \""+this.titulo+"\"}\n"
        +"descripcionE { \""+this.descripcion+"\"}\n"
        +"tipo { \""+this.tipo+"\"}\n"
        +"ejemplo { \""+this.ejemplo+"\"}\n"
        +"tarea { \""+this.tarea+"\"}\n"
        +"resultado{ \""+this.resultado+"\"}\n"
        +"%}\n\n";
    return result;
};

module.exports = Leccion;