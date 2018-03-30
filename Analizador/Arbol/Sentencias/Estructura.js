
function Estructura(){
	this.nombreEstructura = "";
	this.declaracionesEstructura=[];
}
Estructura.prototype.nombreEstructura="";
Estructura.prototype.declaracionesEstructura=[];


Estructura.prototype.setValores = function(nombre, declas) {
	Estructura.prototype.nombreEstructura= nombre;
	Estructura.prototype.declaracionesEstructura= declas;

};

Estructura.prototype.getNombre= function(){
	return Estructura.prototype.nombreEstructura;
};

Estructura.prototype.getDeclas= function(){
	return Estructura.prototype.declaracionesEstructura;
};



