function Repetir(){
	this.expresion = null;
	this.cuerpo=[];
}
Repetir.prototype.expresion=null;
Repetir.prototype.cuerpo=[];


Repetir.prototype.setValores = function(sent, exp) {
	Repetir.prototype.expresion= exp;
	Repetir.prototype.cuerpo= sent;

};

Repetir.prototype.getExpresion= function(){
	return Repetir.prototype.expresion;
};

Repetir.prototype.getCuerpo= function(){
	return Repetir.prototype.cuerpo;
};
