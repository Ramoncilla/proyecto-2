
function AsignaDecla(){
	this.declaracionE = null;
	this.asignacionE=null;
	this.tipo=0;
}

 
AsignaDecla.prototype.setValores = function(decla, asigna, tipo) {
	this.declaracionE= decla;
	this.asignacionE=asigna;
	this.tipo=tipo;

};

AsignaDecla.prototype.getDecla = function() {
	// body...
	return this.declaracionE;
};

AsignaDecla.prototype.getAsigna = function() {
	// body...
	return this.asignacionE;
};


AsignaDecla.prototype.getTipo = function() {
	// body...
	return this.tipo;
};

module.exports=AsignaDecla;
  