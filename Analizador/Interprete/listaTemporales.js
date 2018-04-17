var temporal = require("./temporal");

function listaTemporales(){
    this.listado = [];
}


listaTemporales.prototype.insertarTemporal  = function(temp){
   
   if(this.listado!=0){
        if(this.existeTemporal(temp)){
            //se debe de modificar
            this.modificarTemporal(temp);
           // console.log("Se ha modificado "+ temp.nombre+", valor  "+temp.valor);
        }else{
            //se debe de agregar a la lista
            this.listado.push(temp);
            //console.log("Se ha insertado "+ temp.nombre+", valor  "+temp.valor);

        }
   }else{
       this.listado.push(temp);
       //console.log("Se ha insertado "+ temp.nombre+", valor  "+temp.valor);
   } 

};


listaTemporales.prototype.existeTemporal = function (temp){

    var tempTemporal;
    for(var i =0; i<this.listado.length; i++){
        tempTemporal = this.listado[i];
        if(tempTemporal.nombre.toUpperCase() == temp.nombre.toUpperCase()){
            return true;
        }
    }

    return false;

};

listaTemporales.prototype.modificarTemporal = function(temp){
    
    var tempTemporal;
    for(var i =0; i<this.listado.length; i++){
        tempTemporal = this.listado[i];
        if(tempTemporal.nombre.toUpperCase() == temp.nombre.toUpperCase()){
            this.listado[i].valor = temp.valor;
            break;
        }
    }

};

listaTemporales.prototype.obtenerValorTemporal = function(temp){
    
    var tempTemporal;
    for(var i =0; i<this.listado.length; i++){
        tempTemporal = this.listado[i];
        if(tempTemporal.nombre.toUpperCase() == temp.toUpperCase()){
            return this.listado[i].valor ;
        }
    }
    return "nulo";

};


module.exports= listaTemporales;


