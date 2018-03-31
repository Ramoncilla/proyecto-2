function ValorPuntero(){
	this.estructuraId = "";
	this.valoresEstructura=[];
}




ValorPuntero.prototype.setValores = function(id, arrValores) {
	// body...
	this.estructuraId= id;
	this.valoresEstructura=arrValores;
};


ValorPuntero.prototype.getId= function(){
	return this.estructuraId;
};

ValorPuntero.prototype.getValores= function(){
	return this.valoresEstructura;
};

module.exports=ValorPuntero;