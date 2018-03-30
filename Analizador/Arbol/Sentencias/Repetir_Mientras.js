function Repetir_Mientras(){
	this.expresion = null;
	this.cuerpo=[];
}
Repetir_Mientras.prototype.expresion=null;
Repetir_Mientras.prototype.cuerpo=[];


Repetir_Mientras.prototype.setValores = function(exp,sent) {
	Repetir_Mientras.prototype.expresion= exp;
	Repetir_Mientras.prototype.cuerpo= sent;

};

Repetir_Mientras.prototype.getExpresion= function(){
	return Repetir_Mientras.prototype.expresion;
};

Repetir_Mientras.prototype.getCuerpo= function(){
	return Repetir_Mientras.prototype.cuerpo;
};
