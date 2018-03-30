function DeclaArreglo(){
	this.tipoArreglo ="";
	this.nombreArreglo = "";
	this.dimensionesArreglo = null;

}
DeclaArreglo.prototype.tipoArreglo="";
DeclaArreglo.prototype.nombreArreglo="";
DeclaArreglo.prototype.dimensionesArreglo=null;



DeclaArreglo.prototype.setValores = function(tipo, nombre, dimensiones) {
	DeclaArreglo.prototype.tipoArreglo= tipo;
	DeclaArreglo.prototype.nombreArreglo= nombre;
	DeclaArreglo.prototype.dimensionesArreglo=dimensiones;

};



DeclaArreglo.prototype.getTipo= function(){
	return DeclaArreglo.prototype.tipoArreglo;
};


DeclaArreglo.prototype.getNombre= function(){
	return DeclaArreglo.prototype.nombreArreglo;
};


DeclaArreglo.prototype.getDimension= function(){
	return DeclaArreglo.prototype.dimensionesArreglo;
}; 

module.exports=DeclaArreglo;