function Unario(){
	this.expresion=null;
	this.operador="";
}

Unario.prototype.expresion=null;
Unario.prototype.operador="";


Unario.prototype.setValores= function(exp1, op) {
	// body...
	Unario.prototype.expresion = exp1;
	Unario.prototype.operador = op;
};

Unario.prototype.getExpresion= function(){
	return Unario.prototype.expresion;
};




Unario.prototype.getOperador= function(){
	return Unario.prototype.operador;
};





