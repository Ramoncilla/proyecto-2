function Puntero(){
	this.nombrePuntero="";
	this.valorPuntero=-1;
	this.tipoPuntero="";

}

Puntero.prototype.nombrePuntero="";
Puntero.prototype.valorPuntero=-1;
Puntero.prototype.tipoPuntero="";



Puntero.prototype.setValores = function(tipo, id) {
	// body...
	Puntero.prototype.tipoPuntero= tipo;
	Puntero.prototype.nombrePuntero=id;
};

Puntero.prototype.agregarDireccion= function(valor){
	Puntero.prototype.valorPuntero= valor;
};

Puntero.prototype.destruirPuntero= function(){
	Puntero.prototype.valorPuntero=-1;
};

Puntero.prototype.getNombrePuntero = function() {
	// body...
	return Puntero.prototype.nombrePuntero;
};

Puntero.prototype.getValorPuntero = function() {
	// body...
	return Puntero.prototype.valorPuntero;
};

Puntero.prototype.getTipoPuntero = function() {
	// body...
	return Puntero.prototype.tipoPuntero;
};
