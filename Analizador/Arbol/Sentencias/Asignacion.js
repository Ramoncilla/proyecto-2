
function Asignacion(){
	this.elementoAsignacion = null;
	this.simboloIgual="";
	this.valorAsignacion=null;
	this.tipoAsignacion =0;
}


Asignacion.prototype.setValores = function(elemento, igual,valor,tipo) {
	this.elementoAsignacion= elemento;
	this.simboloIgual=igual;
	this.valorAsignacion=valor;
	this.tipoAsignacion=tipo;

};

Asignacion.prototype.getElemento = function() {
	// body...
	return this.elementoAsignacion;
};

Asignacion.prototype.getSimbolo = function() {
	// body...
	return this.simboloIgual;
};

Asignacion.prototype.getValor = function() {
	// body...
	return this.valorAsignacion;
};

Asignacion.prototype.getTipo = function() {
	// body...
	return this.tipoAsignacion;
};

module.exports=Asignacion;

