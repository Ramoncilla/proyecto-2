

function Entero(){
	this.valorEntero = 0;
}
Entero.prototype.valorEntero=0;


Entero.prototype.setNumero = function(valor) {
	Entero.prototype.valorEntero= parseInt(valor);

};

Entero.prototype.getNumero= function(){
	return Entero.prototype.valorEntero;
};


