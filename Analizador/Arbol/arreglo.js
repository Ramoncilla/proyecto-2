var Atributo = require("./Atributo");
function arreglo(){
    this.lista=[];
}

arreglo.prototype.lista =[];

arreglo.prototype.insertar= function(elemento){
    arreglo.prototype.lista.push(elemento);
};

arreglo.prototype.getLista= function(){
    return arreglo.prototype.lista;
};

arreglo.prototype.mostrar= function(){
    console.log("------INICIo--------");
    for(var i=0; i<arreglo.prototype.lista.length;i++){
        if(arreglo.prototype.lista[i] instanceof Atributo)
            console.log("Tipo Atributo "+ arreglo.prototype.lista[i].getVisibilidad());
    }
};

module.exports=arreglo;