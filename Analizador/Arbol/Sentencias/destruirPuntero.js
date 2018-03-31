function destruirPuntero(){
	this.expresion = "";
}



destruirPuntero.prototype.setValores = function(exp) {
	// body...

	this.expresion=exp;
};

destruirPuntero.prototype.getExpresion = function() {
	// body...

	return this.expresion;
};
module.exports=destruirPuntero;