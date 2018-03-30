function Constructor(){
	this.visibilidad ="";
	this.nombreConstructor = "";
	this.parametros =[];
	this.sentencias =[];

}

Constructor.prototype.visibilidad="publico";
Constructor.prototype.nombreConstructor="";
Constructor.prototype.parametros=[];
Constructor.prototype.sentencias=[];


Constructor.prototype.setValores = function(visib, nombre,para,sent) {
	Constructor.prototype.visibilidad= visib;
	Constructor.prototype.nombreConstructor= nombre;
	Constructor.prototype.parametros=para;
	Constructor.prototype.sentencias=sent;

};


Constructor.prototype.getVisibilidad = function() {
	// body...
	return Constructor.prototype.visibilidad;
};


Constructor.prototype.getNombreConstructor = function() {
	// body...
	return Constructor.prototype.nombreConstructor;
};

Constructor.prototype.getParametros = function() {
	// body...
	return Constructor.prototype.parametros;
};

Constructor.prototype.getSentencias = function() {
	// body...
	return Constructor.prototype.sentencias;
};