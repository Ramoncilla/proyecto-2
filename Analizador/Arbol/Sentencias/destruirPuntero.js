function destruirPuntero(){
	this.expresion = "";
}

destruirPuntero.prototype.expresion= "";

destruirPuntero.prototype.setValores = function(exp) {
	// body...

	destruirPuntero.prototype.expresion=exp;
};

destruirPuntero.prototype.getExpresion = function() {
	// body...

	return destruirPuntero.prototype.expresion;
};
module.exports=destruirPuntero;