
function Contador(){
	this.expresion = null;
	this.cuerpo=[];
}
Contador.prototype.expresion=null;
Contador.prototype.cuerpo=[];


Contador.prototype.setValores = function(exp, sent) {
	Contador.prototype.expresion= exp;
	Contador.prototype.cuerpo= sent;

};

Contador.prototype.getExpresion= function(){
	return Contador.prototype.expresion;
};

Contador.prototype.getCuerpo= function(){
	return Contador.prototype.cuerpo;
};
