function Logica(){
	this.expresion1=null;
	this.expresion2=null;
	this.operador="";
}



Logica.prototype.setValores= function(exp1, exp2, op) {
	// body...
	this.expresion1 = exp1;
	this.expresion2 = exp2;
	this.operador = op;
};

Logica.prototype.getExpresion1= function(){
	return this.expresion1;
};

Logica.prototype.getExpresion2= function(){
	return this.expresion2;
};


Logica.prototype.getOperador= function(){
	return this.operador;
};


module.exports=Logica;


