function Puntero(){
	this.nombrePuntero="";
	this.valorPuntero=-1;
	this.tipoPuntero="";

}


 

Puntero.prototype.setValores = function(tipo, id) {
	// body...
	this.tipoPuntero= tipo;
	this.nombrePuntero=id;
};

Puntero.prototype.agregarDireccion= function(valor){
	this.valorPuntero= valor;
};

Puntero.prototype.destruirPuntero= function(){
	this.valorPuntero=-1;
};

Puntero.prototype.getNombrePuntero = function() {
	// body...
	return this.nombrePuntero;
};

Puntero.prototype.getValorPuntero = function() {
	// body...
	return this.valorPuntero;
};

Puntero.prototype.getTipoPuntero = function() {
	// body...
	return this.tipoPuntero;
};

module.exports=Puntero;
