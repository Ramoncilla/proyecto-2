function Este(){
	this.elemento =null;

}

Este.prototype.elemento=null;


Este.prototype.setValores = function(valor) {
	Este.prototype.elemento=valor;

};


Este.prototype.getElemento = function() {
	// body...
	return Este.prototype.elemento;
};