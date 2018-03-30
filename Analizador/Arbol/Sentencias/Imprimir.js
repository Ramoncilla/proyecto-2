function Imprimir(){
	this.expresion = null;
}
Imprimir.prototype.expresion=null;


Imprimir.prototype.setExpresion = function(exp) {
	Imprimir.prototype.expresionImprimir= exp;
};


Imprimir.prototype.getExpresion= function(){
	return Imprimir.prototype.expresionImprimir;
};
