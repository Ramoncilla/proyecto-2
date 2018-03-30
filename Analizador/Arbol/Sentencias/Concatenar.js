function Concatenar(){
	this.nombreVariable ="";
	this.expresion1=null;
	this.expresion2=null;
	this.tipo=0;
}

Concatenar.prototype.expresion1=null;
Concatenar.prototype.expresion2=null;
Concatenar.prototype.nombreVariable="";
Concatenar.prototype.tipo=0;

Concatenar.prototype.setValores = function(nombre, exp1,exp2,tipo) {
	Concatenar.prototype.nombreVariable= nombre;
	Concatenar.prototype.expresion1= exp1;
	Concatenar.prototype.expresion2= exp2;
	Concatenar.prototype.tipo=tipo;
};


Concatenar.prototype.getNombreVariable= function(){
	return Concatenar.prototype.nombreVariable;
};

Concatenar.prototype.getExpresion1= function(){
	return Concatenar.prototype.expresion1;
};

Concatenar.prototype.getExpresion2= function(){
	return Concatenar.prototype.expresion2;
};

Concatenar.prototype.getTipo= function(){
	return Concatenar.prototype.tipo;
};
