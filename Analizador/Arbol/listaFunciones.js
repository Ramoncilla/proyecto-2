var listaErrores= require("../Errores/listaErrores");
var lErrores = new listaErrores();

function listaFunciones(){
    this.funciones =[];
}

listaFunciones.prototype.existeFuncion = function(nuevaFunc){
    var firmaNueva = nuevaFunc.obtenerFirma();
    var temporalFunc, temporalFirma;  
    if(nuevaFunc.esConstructor){
        if(nuevaFunc.nombreFuncion.toUpperCase() == nuevaFunc.nombreClase.toUpperCase()){
            for(var i=0; i<this.funciones.length;i++){
                temporalFunc= this.funciones[i];
                temporalFirma= temporalFunc.obtenerFirma();
                if(temporalFirma.toUpperCase() == firmaNueva.toUpperCase()){
                    return true;
                }
            }

        }else{
            lErrores.insertarError("Semantico","Constructor no valido, "+ nuevaFunc.nombreFuncion+", debe llamarse "+ nuevaFunc.nombreClase);
            console.log("constructor no valido ");
            return true;
        }

    }else{
        for(var i=0; i<this.funciones.length;i++){
            temporalFunc= this.funciones[i];
            temporalFirma= temporalFunc.obtenerFirma();
            if(temporalFirma.toUpperCase() == firmaNueva.toUpperCase()){
                return true;
            }
        }
        return false;

    }
};

listaFunciones.prototype.insertarFuncion = function(nuevaFunc){

    if(!this.existeFuncion(nuevaFunc)){
        this.funciones.push(nuevaFunc);
        console.log("se ha guardado la funcion " + nuevaFunc.obtenerFirma());
    }else{
        lErrores.insertarError("Semantico","Ha ocurrido un error, no se ha podido guardar la funcion  "+nuevaFunc.nombreFuncion);
        console.log("Error, la funcion con el nombre ya existe "+ nuevaFunc.obtenerFirma());
    } 
   


};

module.exports= listaFunciones;