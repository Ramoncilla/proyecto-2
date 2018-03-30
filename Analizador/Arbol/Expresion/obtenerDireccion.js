function obtenerDireccion(){
	this.expresion = "";
}

obtenerDireccion.prototype.expresion= "";

obtenerDireccion.prototype.setValores = function(exp) {
	// body...

	obtenerDireccion.prototype.expresion=exp;
};

obtenerDireccion.prototype.getExpresion = function() {
	// body...

	return obtenerDireccion.prototype.expresion;
};