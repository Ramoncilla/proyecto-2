
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

Error.prototype.getHTML= function(){

    var encabezado = "<tr>"
                    +"<td>"+this.tipo+"</td>"
                    +"<td>"+this.descripcion+"</td>"
                    +"<td>"+this.columna+"</td>"
                    +"<td>"+this.fila+"</td>"
                    +"</tr>";
    return encabezado;
};

module.exports= Error;