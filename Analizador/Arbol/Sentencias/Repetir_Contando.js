function Repetir_Contando(){
	this.declaracion = null;
	this.expresionDesde=null;
	this.expresionHasta = null;
	this.cuerpo=[];
}
Repetir_Contando.prototype.declaracion = null;
Repetir_Contando.prototype.expresionDesde=null;
Repetir_Contando.prototype.expresionHasta=null;
Repetir_Contando.prototype.cuerpo=[];


Repetir_Contando.prototype.setValores = function(decla,expD,expH,sent) {
	Repetir_Contando.prototype.declaracion=decla;
	Repetir_Contando.prototype.expresionDesde=expD;
	Repetir_Contando.prototype.expresionHasta=expH;
	Repetir_Contando.prototype.cuerpo= sent;

};

Repetir_Contando.prototype.getDeclaracion= function(){
	return Repetir_Contando.prototype.declaracion;
};


Repetir_Contando.prototype.getExpresionHasta= function(){
	return Repetir_Contando.prototype.expresionHasta;
};

Repetir_Contando.prototype.getExpresionDesde= function(){
	return Repetir_Contando.prototype.expresionDesde;
};

Repetir_Contando.prototype.getCuerpo= function(){
	return Repetir_Contando.prototype.cuerpo;
};
