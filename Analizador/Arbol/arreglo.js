var Atributo = require("./Atributo");
var DeclaVariable = require("./Sentencias/DeclaVariable");

function arreglo(){
    this.lista=[];
}

arreglo.prototype.lista =[];

arreglo.prototype.insertar= function(elemento){
    if(elemento instanceof Atributo){
        console.log("quiero guardar el atributo "+ elemento.getVisibilidad());
    }
    var arreglo2=[];
    var temporal ;
    for(var i=0; i<arreglo.prototype.lista.length;i++){
        temporal = arreglo.prototype.lista[i];
        if(temporal instanceof Atributo){
            var atriClonado = temporal.clonar();
            if(atriClonado!=null){
                arreglo2.push(atriClonado);
            }
        }
    }
     arreglo2.push(elemento);

     console.log("------INICIo--------");
     for(var i=0; i<arreglo2.length;i++){
         if(arreglo2[i] instanceof Atributo)
             console.log("Tipo Atributo "+ arreglo2[i].getVisibilidad());
     }

     arreglo.prototype.lista=arreglo2;
   // arreglo.prototype.lista.push(elemento);
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