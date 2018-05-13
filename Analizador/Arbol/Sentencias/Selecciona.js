function Selecciona(){
	this.expresion = null;
	this.casos=[];
	this.defecto = [];
}



Selecciona.prototype.setValores = function(exp,cas, def) {
	this.expresion =exp;
	this.casos= cas;
	this.defecto= def;

};

Selecciona.prototype.getExpresion= function(){
	return Selecciona.prototype.expresion;
};

Selecciona.prototype.getCasos= function(){
	return this.casos;
};

Selecciona.prototype.getDefecto= function(){
	return this.defecto;
};
module.exports=Selecciona;