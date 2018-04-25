function DeclaAsignaPuntero(){
	this.puntero = null;
	this.expresion = null;
}
 
 
DeclaAsignaPuntero.prototype.setValores = function(p, exp) {

	this.puntero= p;
	this.expresion= exp;
};


DeclaAsignaPuntero.prototype.getExpresion = function() {
	// body...
	return this.expresion;
};


DeclaAsignaPuntero.prototype.getPuntero= function(){
	return this.puntero;
};

module.exports=DeclaAsignaPuntero;