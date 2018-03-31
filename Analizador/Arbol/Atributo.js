var DeclaVariable = require("./Sentencias/DeclaVariable");

function Atributo(){
	this.visibilidad ="";
	this.declaracion = null;
}
Atributo.prototype.visibilidad="";
Atributo.prototype.declaracion=null;


Atributo.prototype.setValores = function(visi, decla) {
	Atributo.prototype.visibilidad= visi;
	Atributo.prototype.declaracion= decla;
};


Atributo.prototype.getVisibilidad= function(){
	return Atributo.prototype.visibilidad;
};


Atributo.prototype.getDecla= function(){
	return Atributo.prototype.declaracion;
};


Atributo.prototype.clonar= function(){
	var vis = Atributo.prototype.visibilidad;
	if(Atributo.prototype.declaracion!= null){
		var a = Atributo.prototype.declaracion.clonar();
		var nuevo = new Atributo();
		nuevo.setValores(vis,a);
		return nuevo;
	}

	return null;
};

module.exports=Atributo;
 