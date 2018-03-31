function Repetir(){
	this.expresion = null;
	this.cuerpo=[];
}


Repetir.prototype.setValores = function(sent, exp) {
	this.expresion= exp;
	this.cuerpo= sent;

};

Repetir.prototype.getExpresion= function(){
	return this.expresion;
};

Repetir.prototype.getCuerpo= function(){
	return this.cuerpo;
};
module.exports=Repetir;