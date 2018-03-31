function Decimal(){
	this.valorDecimal = 0;
}



Decimal.prototype.setNumero = function(valor) {
	this.valorDecimal= parseFloat(valor);

};

Decimal.prototype.getNumero= function(){
	return this.valorDecimal;
};

module.exports=Decimal;
