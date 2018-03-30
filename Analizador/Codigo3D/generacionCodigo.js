function generacionCodigo(){
	this.sentenciasArchivo=null;
	this.codigo3D=null;
}

generacionCodigo.prototype.sentenciasArchivo=null;
generacionCodigo.prototype.codigo3D=null;

generacionCodigo.prototype.setArchivo = function(archivo) {
	// body...
	generacionCodigo.prototype.sentenciasArchivo=archivo;
	generacionCodigo.prototype.codigo3D= new Codigo();
};

generacionCodigo.prototype.resolverExpresion = function(first_argument) {
	// body...
};

