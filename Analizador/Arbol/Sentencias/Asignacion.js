
function Asignacion(){
	this.elementoAsignacion = null;
	this.simboloIgual="";
	this.valorAsignacion=null;
	this.tipoAsignacion =0;
}
Asignacion.prototype.elementoAsignacion=null;
Asignacion.prototype.simboloIgual="";
Asignacion.prototype.valorAsignacion=null;
Asignacion.prototype.tipoAsignacion=0;


Asignacion.prototype.setValores = function(elemento, igual,valor,tipo) {
	Asignacion.prototype.elementoAsignacion= elemento;
	Asignacion.prototype.simboloIgual=igual;
	Asignacion.prototype.valorAsignacion=valor;
	Asignacion.prototype.tipoAsignacion=tipo;

};

Asignacion.prototype.getElemento = function() {
	// body...
	return Asignacion.prototype.elementoAsignacion;
};

Asignacion.prototype.getSimbolo = function() {
	// body...
	return Asignacion.prototype.simboloIgual;
};

Asignacion.prototype.getValor = function() {
	// body...
	return Asignacion.prototype.valorAsignacion;
};

Asignacion.prototype.getTipo = function() {
	// body...
	return Asignacion.prototype.tipoAsignacion;
};

