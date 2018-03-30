function Aritmetica(){
	this.expresion1=null;
	this.expresion2=null;
	this.operador="";
}

Aritmetica.prototype.expresion2=null;
Aritmetica.prototype.expresion1=null;
Aritmetica.prototype.operador="";


Aritmetica.prototype.setValores= function(exp1, exp2, op) {
	// body...
	Aritmetica.prototype.expresion1 = exp1;
	Aritmetica.prototype.expresion2 = exp2;
	Aritmetica.prototype.operador = op;
};

Aritmetica.prototype.getExpresion1= function(){
	return Aritmetica.prototype.expresion1;
};

Aritmetica.prototype.getExpresion2= function(){
	return Aritmetica.prototype.expresion2;
};


Aritmetica.prototype.getOperador= function(){
	return Aritmetica.prototype.operador;
};

