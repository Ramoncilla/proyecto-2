function DeclaAsignaPuntero(){
	this.puntero = null;
	this.expresion = null;
}

DeclaAsignaPuntero.prototype.puntero=null;
DeclaAsignaPuntero.prototype.expresion=null;

DeclaAsignaPuntero.prototype.setValores = function(p, exp) {

	DeclaAsignaPuntero.prototype.puntero= p;
	DeclaAsignaPuntero.prototype.expresion= exp;
};


DeclaAsignaPuntero.prototype.getExpresion = function() {
	// body...
	return DeclaAsignaPuntero.prototype.expresion;
};


DeclaAsignaPuntero.prototype.getPuntero= function(){
	return DeclaAsignaPuntero.prototype.puntero;
};

module.exports=DeclaAsignaPuntero;