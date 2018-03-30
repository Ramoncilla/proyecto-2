function Si(){
	this.expresion = null;
	this.sentV=[];
	this.sentF = [];
}
Si.prototype.expresion=null;
Si.prototype.sentV=[];
Si.prototype.sentF=[];

Si.prototype.setValores = function(exp,verdaderas,falsas) {
	Si.prototype.expresion= exp;
	Si.prototype.sentV= verdaderas;
	Si.prototype.sentF= falsas;

};

Si.prototype.getExpresion= function(){
	return Si.prototype.expresion;
};

Si.prototype.getVerdaderas= function(){
	return Si.prototype.sentV;
};

Si.prototype.getFalsas= function(){
	return Si.prototype.sentF;
};
