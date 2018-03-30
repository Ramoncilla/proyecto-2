function Caracter(){
	this.valorEnteroCaracter = 0;
	this.valorCadenaCaracter="";
}
Caracter.prototype.valorEnteroCaracter=0;
Caracter.prototype.valorCadenaCaracter="";


Caracter.prototype.setValorCaracter = function(valor) {
	Caracter.prototype.valorEnteroCaracter= valor.charCodeAt(1);
    Caracter.prototype.valorCadenaCaracter= valor.charAt(1);
};

Caracter.prototype.getEnteroCaracter= function(){
	return Caracter.prototype.valorEnteroCaracter;
};

Caracter.prototype.getCadenaCaracter= function(){
	return Caracter.prototype.valorCadenaCaracter;
}

