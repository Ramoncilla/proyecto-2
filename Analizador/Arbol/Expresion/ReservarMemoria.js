function ReservarMemoria(){
	this.expresion = null;
}



ReservarMemoria.prototype.setValores = function(exp) {
	// body...

	this.expresion=exp;
};

ReservarMemoria.prototype.getExpresion = function() {
	// body...

	return this.expresion;
};
module.exports=ReservarMemoria;