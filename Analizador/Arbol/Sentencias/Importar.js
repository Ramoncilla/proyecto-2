function Importar(){
	this.ruta ="";

}




Importar.prototype.setValores = function(ruta) {
	this.ruta=ruta;

};


Importar.prototype.getRuta = function() {
	// body...
	return this.ruta;
};
module.exports=Importar;