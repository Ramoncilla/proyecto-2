function Ciclo_X(){
	this.expresion1=null;
	this.expresion2 = null;
	this.cuerpo=[];
}



Ciclo_X.prototype.setValores = function(exp1,exp2,sent) {
	this.expresion1=exp1;
	this.expresion2=exp2;
	this.cuerpo= sent;

};

 
Ciclo_X.prototype.getExpresion2= function(){
	return this.expresion2;
};

Ciclo_X.prototype.getExpresion1= function(){
	return this.expresion1;
};

Ciclo_X.prototype.getCuerpo= function(){
	return this.cuerpo;
};

module.exports=Ciclo_X;