function convertirCadena(){
	this.expresionACadena=null;
}



convertirCadena.prototype.setExpresionCadena = function(valor) {
	// body...
	this.expresionACadena= valor;
};


convertirCadena.prototype.getExpresionCadena = function() {
	// body...
	return this.expresionACadena;
};

module.exports=convertirCadena;




