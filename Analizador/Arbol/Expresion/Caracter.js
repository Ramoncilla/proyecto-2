function Caracter(){
	this.valorEnteroCaracter = 0;
	this.valorCadenaCaracter="";
}


 
Caracter.prototype.setValorCaracter = function(valor) {
	this.valorEnteroCaracter= valor.charCodeAt(1);
    this.valorCadenaCaracter= valor.charAt(1);
};

Caracter.prototype.getEnteroCaracter= function(){
	return this.valorEnteroCaracter;
};

Caracter.prototype.getCadenaCaracter= function(){
	return this.valorCadenaCaracter;
}
module.exports=Caracter;
