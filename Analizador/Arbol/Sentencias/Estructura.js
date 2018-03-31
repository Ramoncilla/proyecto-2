
function Estructura(){
	this.nombreEstructura = "";
	this.declaracionesEstructura=[];
}



Estructura.prototype.setValores = function(nombre, declas) {
	this.nombreEstructura= nombre;
	this.declaracionesEstructura= declas;

};

Estructura.prototype.getNombre= function(){
	return this.nombreEstructura;
};

Estructura.prototype.getDeclas= function(){
	return this.declaracionesEstructura;
};

module.exports=Estructura;

