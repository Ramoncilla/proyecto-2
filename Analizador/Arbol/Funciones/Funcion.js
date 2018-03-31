function Funcion(){
	//VISIBILIDAD TIPO_DECLARACION id  LISTA_PARAMETROS  CUERPO_FUNCION
	this.sobreEscrita=false;
	this.visibilidad ="";
	this.tipo=""; 
	this.nombreFuncion = "";
	this.parametros =[];
	this.sentencias =[];

}


Funcion.prototype.setValores = function(visib, tipo, nombre,para,sent) {
	this.visibilidad= visib;
	this.tipo=tipo;
	this.nombreFuncion= nombre;
	this.parametros=para;
	this.sentencias=sent;
	this.sobreEscrita=false;
};


Funcion.prototype.setSobreEscrita = function(val) {
	// body...
	this.sobreEscrita=val;
};


Funcion.prototype.getSobreEscrita = function() {
	// body...
	return this.sobreEscrita;
};

Funcion.prototype.getVisibilidad = function() {
	// body...
	return this.visibilidad;
};

Funcion.prototype.getTipo = function() {
	// body...
	return this.tipo;
};


Funcion.prototype.getNombreFuncion = function() {
	// body...
	return this.nombreFuncion;
};

Funcion.prototype.getParametros = function() {
	// body...
	return this.parametros;
};

Funcion.prototype.getSentencias = function() {
	// body...
	return this.sentencias;
};
module.exports=Funcion;