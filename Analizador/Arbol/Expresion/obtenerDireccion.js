function obtenerDireccion(){
	this.expresion = "";
}

obtenerDireccion.prototype.setValores = function(exp) {
	// body...

	this.expresion=exp;
};

obtenerDireccion.prototype.getExpresion = function() {
	// body...

	return this.expresion;
};

module.exports=obtenerDireccion;