function ObtenerTamanio(){
	this.expresion = null;
}

ObtenerTamanio.prototype.expresion= null;

ObtenerTamanio.prototype.setValores = function(exp) {
	// body...

	ObtenerTamanio.prototype.expresion=exp;
};

ObtenerTamanio.prototype.getExpresion = function() {
	// body...

	return ObtenerTamanio.prototype.expresion;
};

module.exports=ObtenerTamanio;