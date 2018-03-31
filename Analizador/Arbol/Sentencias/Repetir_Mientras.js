function Repetir_Mientras(){
	this.expresion = null;
	this.cuerpo=[];
}



Repetir_Mientras.prototype.setValores = function(exp,sent) {
	this.expresion= exp;
	this.cuerpo= sent;

};

Repetir_Mientras.prototype.getExpresion= function(){
	return this.expresion;
};

Repetir_Mientras.prototype.getCuerpo= function(){
	return this.cuerpo;
};
module.exports=Repetir_Mientras;