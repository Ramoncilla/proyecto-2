
function AsignacionUnario(){
	this.elementoAsignacionUnario = null;
	this.simboloUnario="";
	this.tipoAsignacionUnario =0;
}
AsignacionUnario.prototype.elementoAsignacionUnario=null;
AsignacionUnario.prototype.simboloUnario="";
AsignacionUnario.prototype.tipoAsignacionUnario=0;


AsignacionUnario.prototype.setValores = function(elemento, igual,tipo) {
	AsignacionUnario.prototype.elementoAsignacionUnario= elemento;
	AsignacionUnario.prototype.simboloUnario=igual;
	AsignacionUnario.prototype.tipoAsignacionUnario=tipo;

};

AsignacionUnario.prototype.getElemento = function() {
	// body...
	return AsignacionUnario.prototype.elementoAsignacionUnario;
};

AsignacionUnario.prototype.getSimbolo = function() {
	// body...
	return AsignacionUnario.prototype.simboloUnario;
};


AsignacionUnario.prototype.getTipo = function() {
	// body...
	return AsignacionUnario.prototype.tipoAsignacionUnario;
};

