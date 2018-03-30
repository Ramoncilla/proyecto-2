
function Llamada(){

	this.nombreFuncion="";
	this.parametros =[];
}


Llamada.prototype.nombreFuncion="";
Llamada.prototype.parametros=[];



Llamada.prototype.setValoresLlamada= function(nombre, parametros) {
	// body...
	Llamada.prototype.nombreFuncion = nombre;
	Llamada.prototype.parametros=parametros;
};


Llamada.prototype.getNombreFuncion = function() {
	return Llamada.prototype.nombreFuncion;
	// body...
};


Llamada.prototype.getParametros = function() {
	return Llamada.prototype.parametros;
	// body...
};

