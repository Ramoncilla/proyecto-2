var DeclaVariable = require("./Sentencias/DeclaVariable");

function Atributo(){
	this.visibilidad ="";
	this.declaracion = null;
}



Atributo.prototype.setValores = function(visi, decla) {
	this.visibilidad= visi;
	this.declaracion= decla;
};


Atributo.prototype.getVisibilidad= function(){
	return this.visibilidad;
};


Atributo.prototype.getDecla= function(){
	return this.declaracion;
};



module.exports=Atributo;
 
