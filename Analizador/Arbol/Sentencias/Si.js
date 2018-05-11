function Si(){
	this.expresion = null;
	this.sentV=[];
	this.sentF = [];
}
 
Si.prototype.setValores = function(exp,verdaderas,falsas) {
	this.expresion= exp;
	this.sentV= verdaderas;
	this.sentF= falsas;

};

Si.prototype.getExpresion= function(){
	return this.expresion;
};

Si.prototype.getVerdaderas= function(){
	return this.sentV;
};

Si.prototype.getFalsas= function(){
	return this.sentF;
};
module.exports=Si;