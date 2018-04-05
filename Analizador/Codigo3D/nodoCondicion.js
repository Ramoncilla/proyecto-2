function nodoCondicion(cod){
    this.verdaderas =[];
    this.falsas = [];
    this.codigo=cod;
}


nodoCondicion.prototype.addFalsa= function(falsa){
    this.falsas.push(falsa);

};


nodoCondicion.prototype.addVerdadera = function(verd){
    this.verdaderas.push(verd);

};

module.exports=nodoCondicion;