function Importar(){
	this.ruta ="";

}

Importar.prototype.ruta="";


Importar.prototype.setValores = function(ruta) {
	Importar.prototype.ruta=ruta;

};


Importar.prototype.getRuta = function() {
	// body...
	return Importar.prototype.ruta;
};