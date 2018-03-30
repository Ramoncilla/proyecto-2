function Logica(){
	this.expresion1=null;
	this.expresion2=null;
	this.operador="";
}

Logica.prototype.expresion2=null;
Logica.prototype.expresion1=null;
Logica.prototype.operador="";


Logica.prototype.setValores= function(exp1, exp2, op) {
	// body...
	Logica.prototype.expresion1 = exp1;
	Logica.prototype.expresion2 = exp2;
	Logica.prototype.operador = op;
};

Logica.prototype.getExpresion1= function(){
	return Logica.prototype.expresion1;
};

Logica.prototype.getExpresion2= function(){
	return Logica.prototype.expresion2;
};


Logica.prototype.getOperador= function(){
	return Logica.prototype.operador;
};





