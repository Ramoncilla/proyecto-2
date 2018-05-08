function Cadena(){
	this.valorCadena = "";
}

 

Cadena.prototype.setCadena = function(valor) {
	this.valorCadena= valor.replace("\"", "");
	this.valorCadena = this.valorCadena.replace("\"", "");

};

Cadena.prototype.getCadena= function(){
	return this.valorCadena;
};


module.exports=Cadena;