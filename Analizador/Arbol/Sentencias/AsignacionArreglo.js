
function AsignacionArreglo(){
	this.elementoAsignacionArreglo = null;
	this.dimensiones = [];
	this.simboloIgual="";
	this.valorAsignacionArreglo=null;
	this.tipoAsignacionArreglo =0;
}
 


AsignacionArreglo.prototype.setValores = function(elemento,dimensiones,igual,valor,tipo) {
	this.elementoAsignacionArreglo= elemento;
	this.simboloIgual=igual;
	this.valorAsignacionArreglo=valor;
	this.tipoAsignacionArreglo=tipo;
	this.dimensiones=dimensiones;

};

AsignacionArreglo.prototype.getElemento = function() {
	// body...
	return this.elementoAsignacionArreglo;
};

AsignacionArreglo.prototype.getSimbolo = function() {
	// body...
	return this.simboloIgual;
};

AsignacionArreglo.prototype.getValor = function() {
	// body...
	return this.valorAsignacionArreglo;
};

AsignacionArreglo.prototype.getTipo = function() {
	// body...
	return this.tipoAsignacionArreglo;
};

AsignacionArreglo.prototype.getDimensiones = function() {
	// body...
	return this.dimensiones;
};

module.exports=AsignacionArreglo;