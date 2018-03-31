function Concatenar(){
	this.nombreVariable ="";
	this.expresion1=null;
	this.expresion2=null;
	this.tipo=0;
}


Concatenar.prototype.setValores = function(nombre, exp1,exp2,tipo) {
	this.nombreVariable= nombre;
	this.expresion1= exp1;
	this.expresion2= exp2;
	this.tipo=tipo;
};


Concatenar.prototype.getNombreVariable= function(){
	return this.nombreVariable;
};

Concatenar.prototype.getExpresion1= function(){
	return this.expresion1;
};

Concatenar.prototype.getExpresion2= function(){
	return this.expresion2;
};

Concatenar.prototype.getTipo= function(){
	return this.tipo;
};

module.exports=Concatenar;