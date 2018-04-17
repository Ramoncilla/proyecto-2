function DeclaArreglo(){
	this.tipoArreglo ="";
	this.nombreArreglo = "";
	this.dimensionesArreglo = null;

} 




DeclaArreglo.prototype.setValores = function(tipo, nombre, dimensiones) {
	this.tipoArreglo= tipo;
	this.nombreArreglo= nombre;
	this.dimensionesArreglo=dimensiones;

};



DeclaArreglo.prototype.getTipo= function(){
	return this.tipoArreglo;
};


DeclaArreglo.prototype.getNombre= function(){
	return this.nombreArreglo;
};


DeclaArreglo.prototype.getDimension= function(){
	return this.dimensionesArreglo;
}; 

module.exports=DeclaArreglo;