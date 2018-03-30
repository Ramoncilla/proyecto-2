function Hacer_Mientras(){
	this.expresion = null;
	this.cuerpo=[];
}
Hacer_Mientras.prototype.expresion=null;
Hacer_Mientras.prototype.cuerpo=[];


Hacer_Mientras.prototype.setValores = function(sent, exp) {
	Hacer_Mientras.prototype.expresion= exp;
	Hacer_Mientras.prototype.cuerpo= sent;

};

Hacer_Mientras.prototype.getExpresion= function(){
	return Hacer_Mientras.prototype.expresion;
};

Hacer_Mientras.prototype.getCuerpo= function(){
	return Hacer_Mientras.prototype.cuerpo;
};
