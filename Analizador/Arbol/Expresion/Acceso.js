var t_id = require("./t_id");

function Acceso(){

	this.objeto=null;
	this.elementosAcceso =[];
}


  

Acceso.prototype.obtenerIdUltimo = function(){
	var n = this.elementosAcceso.length-1;
	var t = this.elementosAcceso[n];
	if(t instanceof t_id){
		return t.nombreId;
	}

	return "";

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