
function Error(){
    this.columna =0;
    this.fila =0;
    this.tipo="";
    this.descripcion ="";
}

Error.prototype.setValores= function(tipo, desc){
    this.tipo= tipo;
    this.descripcion= desc;
};

module.exports= Error;