function Relacional(){
	this.expresion1=null;
	this.expresion2=null;
	this.operador="";
}




Relacional.prototype.setValores= function(exp1, exp2, op) {
	// body...
	this.expresion1 = exp1;
	this.expresion2 = exp2;
	this.operador = op;
};

Relacional.prototype.getExpresion1= function(){
	return this.expresion1;
};

Relacional.prototype.getExpresion2= function(){
	return this.expresion2;
};


Relacional.prototype.getOperador= function(){
	return this.operador;
};

module.exports=Relacional;