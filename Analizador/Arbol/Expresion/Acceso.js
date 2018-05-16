function Acceso(){

	this.objeto=null;
	this.elementosAcceso =[];
}


  



Acceso.prototype.setValores= function(obj, elementosAcceso) {
	// body...
	this.objeto = obj;
	this.elementosAcceso=elementosAcceso;
};


Acceso.prototype.getobjeto = function() {
	return this.objeto;
	// body...
};


Acceso.prototype.getelementosAcceso = function() {
	return this.elementosAcceso;
	// body...
};

module.exports=Acceso;