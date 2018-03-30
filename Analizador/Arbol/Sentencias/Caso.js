
function Caso(){
	this.expresion = null;
	this.cuerpo=[];
}
Caso.prototype.expresion=null;
Caso.prototype.cuerpo=[];


Caso.prototype.setValores = function(exp,sent) {
	Caso.prototype.expresion= exp;
	Caso.prototype.cuerpo= sent;

};

Caso.prototype.getExpresion= function(){
	return Caso.prototype.expresion;
};

Caso.prototype.getCuerpo= function(){
	return Caso.prototype.cuerpo;
};
