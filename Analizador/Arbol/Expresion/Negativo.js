function Negativo(){
	this.expresion=null;
}

Negativo.prototype.expresion=null;


Negativo.prototype.setExpresion = function(valor) {
	// body...
	Negativo.prototype.expresion = valor;
};

Negativo.prototype.getExpresion= function(){
	return Negativo.prototype.expresion;
};







