function Decimal(){
	this.valorDecimal = 0;
}
Decimal.prototype.valorDecimal=0;


Decimal.prototype.setNumero = function(valor) {
	Decimal.prototype.valorDecimal= parseFloat(valor);

};

Decimal.prototype.getNumero= function(){
	return Decimal.prototype.valorDecimal;
};


