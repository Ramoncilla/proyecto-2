function convertirEntero(){
	this.expresionEntero=null;
}




convertirEntero.prototype.setExpresionEntero = function(valor) {
	// body...
	this.expresionEntero= valor;
};


convertirEntero.prototype.getExpresionEntero = function() {
	// body...
	return this.expresionEntero;
};

module.exports=convertirEntero;

