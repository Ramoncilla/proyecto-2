function ValorPuntero(){
	this.estructuraId = "";
	this.valoresEstructura=[];
}

ValorPuntero.prototype.estructuraId="";
ValorPuntero.prototype.valoresEstructura=[];


ValorPuntero.prototype.setValores = function(id, arrValores) {
	// body...
	ValorPuntero.prototype.estructuraId= id;
	ValorPuntero.prototype.valoresEstructura=arrValores;
};


ValorPuntero.prototype.getId= function(){
	return ValorPuntero.prototype.estructuraId;
};

ValorPuntero.prototype.getValores= function(){
	return ValorPuntero.prototype.valoresEstructura;
};