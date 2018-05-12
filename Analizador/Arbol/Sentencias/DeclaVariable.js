function DeclaVariable(){
	this.tipoVariable ="";
	this.nombreVariable = "";
}

 
DeclaVariable.prototype.setValores = function(tipo, nombre) {
	this.tipoVariable= tipo;
	this.nombreVariable= nombre;
};



DeclaVariable.prototype.getTipo= function(){
	return this.tipoVariable;
};


DeclaVariable.prototype.getNombre= function(){
	return this.nombreVariable;
};

DeclaVariable.prototype.clonar=function(){
	 var tipo = this.tipoVariable;
	 var nombre = this.nombreVariable;
	 var nuevaVar = new DeclaVariable();
	 nuevaVar.setValores(tipo,nombre);
	 return nuevaVar;

};

module.exports=DeclaVariable;