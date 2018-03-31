
function Booleano(){
	this.valorCadenaBooleano = "false";
	this.valorEnteroBooleano=0;
}



Booleano.prototype.setValorBooleano = function(valor) {
	this.valorCadenaBooleano = valor;
	
	if(valor.toUpperCase() == "TRUE"){
		this.valorEnteroBooleano=1;
	}else{
		this.valorEnteroBooleano=0;
	}
};

Booleano.prototype.getEnteroBooleano= function(){
	return this.valorEnteroBooleano;
};

Booleano.prototype.getCadenaBooleano= function(){
	return this.valorCadenaBooleano;
};

module.exports=Booleano;