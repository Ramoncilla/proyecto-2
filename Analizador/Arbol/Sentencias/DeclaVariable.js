function DeclaVariable(){
	this.tipoVariable ="";
	this.nombreVariable = "";
}
DeclaVariable.prototype.tipoVariable="";
DeclaVariable.prototype.nombreVariable="";

DeclaVariable.prototype.setValores = function(tipo, nombre) {
	DeclaVariable.prototype.tipoVariable= tipo;
	DeclaVariable.prototype.nombreVariable= nombre;
};



DeclaVariable.prototype.getTipo= function(){
	return DeclaVariable.prototype.tipoVariable;
};


DeclaVariable.prototype.getNombre= function(){
	return DeclaVariable.prototype.nombreVariable;
};

DeclaVariable.prototype.clonar=function(){
	 var tipo = DeclaVariable.prototype.tipoVariable;
	 var nombre = DeclaVariable.prototype.nombreVariable;
	 var nuevaVar = new DeclaVariable();
	 nuevaVar.setValores(tipo,nombre);
	 return nuevaVar;

};

module.exports=DeclaVariable;