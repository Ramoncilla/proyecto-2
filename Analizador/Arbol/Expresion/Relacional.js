function Relacional(){
	this.expresion1=null;
	this.expresion2=null;
	this.operador="";
}

Relacional.prototype.expresion2=null;
Relacional.prototype.expresion1=null;
Relacional.prototype.operador="";


Relacional.prototype.setValores= function(exp1, exp2, op) {
	// body...
	Relacional.prototype.expresion1 = exp1;
	Relacional.prototype.expresion2 = exp2;
	Relacional.prototype.operador = op;
};

Relacional.prototype.getExpresion1= function(){
	return Relacional.prototype.expresion1;
};

Relacional.prototype.getExpresion2= function(){
	return Relacional.prototype.expresion2;
};


Relacional.prototype.getOperador= function(){
	return Relacional.prototype.operador;
};

