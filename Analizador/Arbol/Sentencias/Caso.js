
function Caso(){
	this.expresion = null;
	this.cuerpo=[];
}



Caso.prototype.setValores = function(exp,sent) {
	this.expresion= exp;
	this.cuerpo= sent;

};

Caso.prototype.getExpresion= function(){
	return this.expresion;
};

Caso.prototype.getCuerpo= function(){
	return this.cuerpo;
};

module.exports=Caso;