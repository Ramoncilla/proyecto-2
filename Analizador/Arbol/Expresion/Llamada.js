
function Llamada(){

	this.nombreFuncion="";
	this.parametros =[];
}



Llamada.prototype.setValoresLlamada= function(nombre, parametros) {
	// body...
	this.nombreFuncion = nombre;
	this.parametros=parametros;
};


Llamada.prototype.getNombreFuncion = function() {
	return this.nombreFuncion;
	// body...
};


Llamada.prototype.getParametros = function() {
	return this.parametros;
	// body...
};

module.exports=Llamada;
 