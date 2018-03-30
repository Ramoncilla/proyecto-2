function Ciclo_X(){
	this.expresion1=null;
	this.expresion2 = null;
	this.cuerpo=[];
}
Ciclo_X.prototype.expresion1=null;
Ciclo_X.prototype.expresion2=null;
Ciclo_X.prototype.cuerpo=[];


Ciclo_X.prototype.setValores = function(exp1,exp2,sent) {
	Ciclo_X.prototype.expresion1=exp1;
	Ciclo_X.prototype.expresion2=exp2;
	Ciclo_X.prototype.cuerpo= sent;

};


Ciclo_X.prototype.getExpresion2= function(){
	return Ciclo_X.prototype.expresion2;
};

Ciclo_X.prototype.getExpresion1= function(){
	return Ciclo_X.prototype.expresion1;
};

Ciclo_X.prototype.getCuerpo= function(){
	return Ciclo_X.prototype.cuerpo;
};
