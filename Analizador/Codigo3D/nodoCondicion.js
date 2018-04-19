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
        cadena +=this.verdaderas[i]+":\n";
    }
    return cadena;

};


nodoCondicion.prototype.getEtiquetasFalsas= function(){
    var cadena ="";
    for(var i =0; i<this.falsas.length; i++){
        cadena +=this.falsas[i]+":\n";
    }
    return cadena

};

module.exports=nodoCondicion;