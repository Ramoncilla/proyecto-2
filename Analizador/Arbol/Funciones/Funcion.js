function Funcion(){
	//VISIBILIDAD TIPO_DECLARACION id  LISTA_PARAMETROS  CUERPO_FUNCION
	this.sobreEscrita=false;
	this.visibilidad ="";
	this.tipo=""; 
	this.nombreFuncion = "";
	this.parametros =[];
	this.sentencias =[];

}
Funcion.prototype.sobreEscrita=false;
Funcion.prototype.visibilidad="publico";
Funcion.prototype.tipo="";
Funcion.prototype.nombreFuncion="";
Funcion.prototype.parametros=[];
Funcion.prototype.sentencias=[];


Funcion.prototype.setValores = function(visib, tipo, nombre,para,sent) {
	Funcion.prototype.visibilidad= visib;
	Funcion.prototype.tipo=tipo;
	Funcion.prototype.nombreFuncion= nombre;
	Funcion.prototype.parametros=para;
	Funcion.prototype.sentencias=sent;
	Funcion.prototype.sobreEscrita=false;
};


Funcion.prototype.setSobreEscrita = function(val) {
	// body...
	Funcion.prototype.sobreEscrita=val;
};


Funcion.prototype.getSobreEscrita = function() {
	// body...
	return Funcion.prototype.sobreEscrita;
};

Funcion.prototype.getVisibilidad = function() {
	// body...
	return Funcion.prototype.visibilidad;
};

Funcion.prototype.getTipo = function() {
	// body...
	return Funcion.prototype.tipo;
};


Funcion.prototype.getNombreFuncion = function() {
	// body...
	return Funcion.prototype.nombreFuncion;
};

Funcion.prototype.getParametros = function() {
	// body...
	return Funcion.prototype.parametros;
};

Funcion.prototype.getSentencias = function() {
	// body...
	return Funcion.prototype.sentencias;
};