function Aritmetica(){
	this.expresion1=null;
	this.expresion2=null;
	this.operador="";
}

 

Aritmetica.prototype.setValores= function(exp1, exp2, op) {
	// body...
	this.expresion1 = exp1;
	this.expresion2 = exp2;
	this.operador = op;
};

Aritmetica.prototype.getExpresion1= function(){
	return this.expresion1;
};

Aritmetica.prototype.getExpresion2= function(){
	return this.expresion2;
};


Aritmetica.prototype.getOperador= function(){
	return this.operador;
};

module.exports=Aritmetica;

