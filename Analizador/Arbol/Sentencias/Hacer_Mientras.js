function Hacer_Mientras(){
	this.expresion = null;
	this.cuerpo=[];
}



Hacer_Mientras.prototype.setValores = function(sent, exp) {
	this.expresion= exp;
	this.cuerpo= sent;

};

Hacer_Mientras.prototype.getExpresion= function(){
	return this.expresion;
};

Hacer_Mientras.prototype.getCuerpo= function(){
	return this.cuerpo;
};
module.exports=Hacer_Mientras;