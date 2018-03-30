function Nulo(){
	this.valorNulo = "nada";
}
Nulo.prototype.valorNulo="nada";


Nulo.prototype.setNulo = function() {
	 Nulo.prototype.valorNulo= "nada";

};

Nulo.prototype.getNulo= function(){
	return  Nulo.prototype.valorNulo;
};

