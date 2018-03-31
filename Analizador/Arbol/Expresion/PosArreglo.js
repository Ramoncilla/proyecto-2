
function PosArreglo(){

	this.nombreArreglo="";
	this.posicionesArreglo =[];
}





PosArreglo.prototype.setValores = function(nombre, posiciones) {
	// body...
	this.nombreArreglo=nombre;
	this.posicionesArreglo= posiciones;
};


PosArreglo.prototype.getNombreArreglo = function() {
	
	return this.nombreArreglo;
};


PosArreglo.prototype.getPosicionesArreglo = function() {
	// body...
	return this.posicionesArreglo;
};


module.exports=PosArreglo;