function Acceso(){

	this.objeto=null;
	this.elementosAcceso =[];
}


Acceso.prototype.objeto="";
Acceso.prototype.elementosAcceso=[];



Acceso.prototype.setValores= function(obj, elementosAcceso) {
	// body...
	Acceso.prototype.objeto = obj;
	Acceso.prototype.elementosAcceso=elementosAcceso;
};


Acceso.prototype.getobjeto = function() {
	return Acceso.prototype.objeto;
	// body...
};


Acceso.prototype.getelementosAcceso = function() {
	return Acceso.prototype.elementosAcceso;
	// body...
};

module.exports=Acceso;