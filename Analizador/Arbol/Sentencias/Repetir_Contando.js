function Repetir_Contando(){
	this.declaracion = null;
	this.expresionDesde=null;
	this.expresionHasta = null;
	this.cuerpo=[];
}

 

Repetir_Contando.prototype.setValores = function(decla,expD,expH,sent) {
	this.declaracion=decla;
	this.expresionDesde=expD;
	this.expresionHasta=expH;
	this.cuerpo= sent;

};

Repetir_Contando.prototype.getDeclaracion= function(){
	return this.declaracion;
};


Repetir_Contando.prototype.getExpresionHasta= function(){
	return this.expresionHasta;
};

Repetir_Contando.prototype.getExpresionDesde= function(){
	return Repetir_Contando.prototype.expresionDesde;
};

Repetir_Contando.prototype.getCuerpo= function(){
	return this.cuerpo;
};
module.exports=Repetir_Contando;