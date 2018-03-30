
function AsignaDecla(){
	this.declaracionE = null;
	this.asignacionE=null;
	this.tipo=0;
}
AsignaDecla.prototype.declaracionE=null;
AsignaDecla.prototype.asignacionE=null;
AsignaDecla.prototype.tipo=0;


AsignaDecla.prototype.setValores = function(decla, asigna, tipo) {
	AsignaDecla.prototype.declaracionE= decla;
	AsignaDecla.prototype.asigna=asigna;
	AsignaDecla.prototype.tipo=tipo;

};

AsignaDecla.prototype.getDecla = function() {
	// body...
	return AsignaDecla.prototype.declaracionE;
};

AsignaDecla.prototype.getAsigna = function() {
	// body...
	return AsignaDecla.prototype.asignacionE;
};


AsignaDecla.prototype.getTipo = function() {
	// body...
	return AsignaDecla.prototype.tipo;
};

  