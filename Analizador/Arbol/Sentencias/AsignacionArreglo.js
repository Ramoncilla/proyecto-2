
function AsignacionArreglo(){
	this.elementoAsignacionArreglo = null;
	this.dimensiones = [];
	this.simboloIgual="";
	this.valorAsignacionArreglo=null;
	this.tipoAsignacionArreglo =0;
}
AsignacionArreglo.prototype.elementoAsignacionArreglo=null;
AsignacionArreglo.prototype.dimensiones=[];
AsignacionArreglo.prototype.simboloIgual="";
AsignacionArreglo.prototype.valorAsignacionArreglo=null;
AsignacionArreglo.prototype.tipoAsignacionArreglo=0;


AsignacionArreglo.prototype.setValores = function(elemento,dimensiones,igual,valor,tipo) {
	AsignacionArreglo.prototype.elementoAsignacionArreglo= elemento;
	AsignacionArreglo.prototype.simboloIgual=igual;
	AsignacionArreglo.prototype.valorAsignacionArreglo=valor;
	AsignacionArreglo.prototype.tipoAsignacionArreglo=tipo;
	AsignacionArreglo.prototype.dimensiones=dimensiones;

};

AsignacionArreglo.prototype.getElemento = function() {
	// body...
	return AsignacionArreglo.prototype.elementoAsignacionArreglo;
};

AsignacionArreglo.prototype.getSimbolo = function() {
	// body...
	return AsignacionArreglo.prototype.simboloIgual;
};

AsignacionArreglo.prototype.getValor = function() {
	// body...
	return AsignacionArreglo.prototype.valorAsignacionArreglo;
};

AsignacionArreglo.prototype.getTipo = function() {
	// body...
	return AsignacionArreglo.prototype.tipoAsignacionArreglo;
};

AsignacionArreglo.prototype.getDimensiones = function() {
	// body...
	return AsignacionArreglo.prototype.dimensiones;
};
