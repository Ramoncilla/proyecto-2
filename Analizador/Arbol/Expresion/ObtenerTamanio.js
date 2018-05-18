function ObtenerTamanio(){
	this.expresion = null;
}


 
ObtenerTamanio.prototype.setValores = function(exp) {
	// body...

	this.expresion=exp;
};

ObtenerTamanio.prototype.getExpresion = function() {
	// body...

	return this.expresion;
};

module.exports=ObtenerTamanio;