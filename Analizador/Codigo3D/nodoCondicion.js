function nodoCondicion(cod){
    this.verdaderas =[];
    this.falsas = [];
    this.codigo=cod;
}


nodoCondicion.prototype.addEtiquetasVerdaderas = function(ets){
    for(var i =0; i<ets.length; i++){
        this.verdaderas.push(ets[i]);
    }
};

nodoCondicion.prototype.addEtiquetasFalsas = function(ets){
    for(var i =0; i<ets.length; i++){
        this.falsas.push(ets[i]);
    }
};



nodoCondicion.prototype.addFalsa= function(falsa){
    this.falsas.push(falsa);

};


nodoCondicion.prototype.addVerdadera = function(verd){
    this.verdaderas.push(verd);

};

nodoCondicion.prototype.getCodigo = function(){
    return this.codigo;
};

nodoCondicion.prototype.getEtiquetasVerdaderas = function(){
    var cadena ="";
    for(var i =0; i<this.verdaderas.length; i++){
       // cadena+="jmp, , , "+this.verdaderas[i]+";\n";
        cadena +=this.verdaderas[i]+":\n";
    }
    return cadena;
};


nodoCondicion.prototype.getEtiquetasFalsas= function(){
    var cadena ="";
    for(var i =0; i<this.falsas.length; i++){
       // cadena+="jmp, , , "+this.falsas[i]+";\n";
        cadena +=this.falsas[i]+":\n";
    }
    return cadena
};


nodoCondicion.prototype.cambiarEtiquetas = function(){
    var falsasTemporales = this.falsas.slice();
    var verdaderasTemporales= this.verdaderas.slice();

    this.verdaderas= [];
    this.falsas = [];
    for(var i = 0; i< falsasTemporales.length; i++){
        this.verdaderas.push(falsasTemporales[i]);
    }

    for(var i = 0; i< verdaderasTemporales.length; i++){
        this.falsas.push(verdaderasTemporales[i]);
    }

};

module.exports=nodoCondicion;