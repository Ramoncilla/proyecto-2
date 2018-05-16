function Unario(){
	this.expresion=null;
	this.operador="";
}



Unario.prototype.setValores= function(exp1, op) {
	// body...
	this.expresion = exp1;
	this.operador = op;
};

Unario.prototype.getExpresion= function(){
	return this.expresion;
};

Unario.prototype.getOperador= function(){
	return this.operador;
};

module.exports=Unario;




