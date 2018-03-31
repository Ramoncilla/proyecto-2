function Cadena(){
	this.valorCadena = "";
}



Cadena.prototype.setCadena = function(valor) {
	this.valorCadena= valor;

};

Cadena.prototype.getCadena= function(){
	return this.valorCadena;
};


module.exports=Cadena;