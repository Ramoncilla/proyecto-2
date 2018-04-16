function Imprimir(){
	this.expresionImprimir = null;
}



Imprimir.prototype.setExpresion = function(exp) {
	this.expresionImprimir= exp;
};


Imprimir.prototype.getExpresion= function(){
	return this.expresionImprimir;
};
module.exports=Imprimir;