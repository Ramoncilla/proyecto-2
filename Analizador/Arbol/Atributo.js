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

module.exports=Atributo;
 