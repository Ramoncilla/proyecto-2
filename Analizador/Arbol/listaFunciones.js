
function listaFunciones(){
    this.funciones =[];
}

listaFunciones.prototype.existeFuncion = function(nuevaFunc){
    var firmaNueva = nuevaFunc.obtenerFirma();
    var temporalFunc, temporalFirma;
    for(var i=0; i<this.funciones.length;i++){
        temporalFunc= this.funciones[i];
        temporalFirma= temporalFunc.obtenerFirma();
        if(temporalFirma.toUpperCase() == firmaNueva.toUpperCase()){
            return true;
        }
    }


    return false;

};

listaFunciones.prototype.insertarFuncion = function(nuevaFunc){

    if(!this.existeFuncion(nuevaFunc)){
        this.funciones.push(nuevaFunc);
        console.log("se ha guardado la funcion " + nuevaFunc.obtenerFirma());
    }else{
        console.log("Error, la funcion con el nombre ya existe");
    }
   


};

module.exports= listaFunciones;