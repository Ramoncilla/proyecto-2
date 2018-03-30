function Cadena(){
	this.valorCadena = "";
}
Cadena.prototype.valorCadena="";


Cadena.prototype.setCadena = function(valor) {
	Cadena.prototype.valorCadena= valor;

};

Cadena.prototype.getCadena= function(){
	return Cadena.prototype.valorCadena;
};


