
function Contador(){
	this.expresion = null;
	this.cuerpo=[];
}


Contador.prototype.setValores = function(exp, sent) {
	this.expresion= exp;
	this.cuerpo= sent;

};

Contador.prototype.getExpresion= function(){
	return this.expresion;
};

Contador.prototype.getCuerpo= function(){
	return this.cuerpo;
};
module.exports=Contador;