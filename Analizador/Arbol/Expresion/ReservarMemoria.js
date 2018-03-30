function ReservarMemoria(){
	this.expresion = null;
}

ReservarMemoria.prototype.expresion= null;

ReservarMemoria.prototype.setValores = function(exp) {
	// body...

	ReservarMemoria.prototype.expresion=exp;
};

ReservarMemoria.prototype.getExpresion = function() {
	// body...

	return ReservarMemoria.prototype.expresion;
};