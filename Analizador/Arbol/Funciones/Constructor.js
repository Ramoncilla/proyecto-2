function Constructor(){
	this.visibilidad ="";
	this.nombreConstructor = "";
	this.parametros =[];
	this.sentencias =[];

}


Constructor.prototype.setValores = function(visib, nombre,para,sent) {
	this.visibilidad= visib;
	this.nombreConstructor= nombre;
	this.parametros=para;
	this.sentencias=sent;

};


Constructor.prototype.getVisibilidad = function() {
	// body...
	return this.visibilidad;
};


Constructor.prototype.getNombreConstructor = function() {
	// body...
	return this.nombreConstructor;
};

Constructor.prototype.getParametros = function() {
	// body...
	return this.parametros;
};

Constructor.prototype.getSentencias = function() {
	// body...
	return this.sentencias;
};
module.exports=Constructor;