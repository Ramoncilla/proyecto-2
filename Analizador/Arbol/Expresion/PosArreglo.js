
function PosArreglo(){

	this.nombreArreglo="";
	this.posicionesArreglo =[];
}


PosArreglo.prototype.nombreArreglo="";
PosArreglo.prototype.posicionesArreglo=[];


PosArreglo.prototype.setValores = function(nombre, posiciones) {
	// body...
	PosArreglo.prototype.nombreArreglo=nombre;
	PosArreglo.prototype.posicionesArreglo= posiciones;
};


PosArreglo.prototype.getNombreArreglo = function() {
	
	return PosArreglo.prototype.nombreArreglo;
};


PosArreglo.prototype.getPosicionesArreglo = function() {
	// body...
	return PosArreglo.prototype.posicionesArreglo;
};


