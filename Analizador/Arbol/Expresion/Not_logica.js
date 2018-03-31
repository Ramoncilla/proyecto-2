function Not_logica(){
	this.expresion=null;
}




Not_logica.prototype.setExpresion = function(valor) {
	// body...
	this.expresion = valor;
};

Not_logica.prototype.getExpresion= function(){
	return this.expresion;
};

module.exports=Not_logica;


