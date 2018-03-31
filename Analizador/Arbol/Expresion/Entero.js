

function Entero(){
	this.valorEntero = 0;
}



Entero.prototype.setNumero = function(valor) {
	this.valorEntero= parseInt(valor);

};

Entero.prototype.getNumero= function(){
	return this.valorEntero;
};


module.exports=Entero;