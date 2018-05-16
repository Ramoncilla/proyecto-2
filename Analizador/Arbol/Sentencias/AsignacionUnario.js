
function AsignacionUnario(){
	this.elementoAsignacionUnario = null;
	this.simboloUnario="";
	this.tipoAsignacionUnario =0;
}

 

AsignacionUnario.prototype.setValores = function(elemento, igual,tipo) {
	this.elementoAsignacionUnario= elemento;
	this.simboloUnario=igual;
	this.tipoAsignacionUnario=tipo;

};

AsignacionUnario.prototype.getElemento = function() {
	// body...
	return this.elementoAsignacionUnario;
};

AsignacionUnario.prototype.getSimbolo = function() {
	// body...
	return this.simboloUnario;
};


AsignacionUnario.prototype.getTipo = function() {
	// body...
	return this.tipoAsignacionUnario;
};

module.exports=AsignacionUnario;