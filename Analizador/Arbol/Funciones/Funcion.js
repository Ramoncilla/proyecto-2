var listaParametros = require("./listaParametros");
var Parametro = require("./Parametro");

function Funcion(){
	this.sobreEscrita=false;
	this.visibilidad ="";
	this.tipo=""; 
	this.nombreFuncion = "";
	this.parametrosArre =[];
	this.sentencias =[];
	this.parametros = new listaParametros();
	this.nombreClase ="";
	this.esConstructor=false;
}

Funcion.prototype.cambiarAConstructor= function(){
	this.esConstructor=true;
};

Funcion.prototype.setNombreClase= function(clase){
    console.log(clase + "sjfdshfkjdsfdsfddddddddddddddddddddddd");
	this.nombreClase= clase;
};

Funcion.prototype.obtenerNoParametros= function(){
	return this.parametros.parametros.length;
};

Funcion.prototype.obtenerCadenaParametros = function(){
	return this.parametros.getCadenaParametros();
};

Funcion.prototype.setValores = function(visib, tipo, nombre,para,sent) {
	this.visibilidad= visib;
	this.tipo=tipo;
	this.nombreFuncion= nombre;
	this.parametrosArre=para;
	this.sentencias=sent;
	this.sobreEscrita=false;
	this.iniciarParametros();
};

Funcion.prototype.obtenerFirma= function(){
	var firma=this.nombreClase+"_"+this.tipo+"_"+this.nombreFuncion;
	var temporal;
	for(var i=0; i<this.parametros.parametros.length;i++){
		temporal = this.parametros.parametros[i];
		firma+="_"+temporal.getTipo();
	}
	return firma;
};

Funcion.prototype.iniciarParametros= function(){
	var temporal;
	for(var i = 0; i<this.parametrosArre.length;i++){
		temporal = this.parametrosArre[i];
		this.parametros.insertarParametro(temporal);
	}

	console.log("la funcion " + this.nombreFuncion+" posee "+ this.parametros.parametros.length+" parametros");
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