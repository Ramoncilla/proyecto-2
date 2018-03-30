
function Booleano(){
	this.valorCadenaBooleano = "false";
	this.valorEnteroBooleano=0;
}

Booleano.prototype.valorCadenaBooleano="false";
Booleano.prototype.valorEnteroBooleano=0;


Booleano.prototype.setValorBooleano = function(valor) {
	Booleano.prototype.valorCadenaBooleano = valor;
	
	if(valor.toUpperCase() == "TRUE"){
		Booleano.prototype.valorEnteroBooleano=1;
	}else{
		Booleano.prototype.valorEnteroBooleano=0;
	}
};

Booleano.prototype.getEnteroBooleano= function(){
	return Booleano.prototype.valorEnteroBooleano;
};

Booleano.prototype.getCadenaBooleano= function(){
	return Booleano.prototype.valorCadenaBooleano;
}

