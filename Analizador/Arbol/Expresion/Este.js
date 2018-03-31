function Este(){
	this.elemento =null;

}



Este.prototype.setValores = function(valor) {
	this.elemento=valor;

};


Este.prototype.getElemento = function() {
	// body...
	return this.elemento;
};

module.exports=Este;