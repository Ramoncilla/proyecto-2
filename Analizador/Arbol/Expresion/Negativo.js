function Negativo(){
	this.expresion=null;
}




Negativo.prototype.setExpresion = function(valor) {
	// body...
	this.expresion = valor;
};

Negativo.prototype.getExpresion= function(){
	return this.expresion;
};

module.exports=Negativo;





