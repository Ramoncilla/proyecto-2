function Selecciona(){
	this.expresion = null;
	this.casos=[];
	this.defecto = [];
}
Selecciona.prototype.expresion=null;
Selecciona.prototype.casos=[];
Selecciona.prototype.defecto=[];

Selecciona.prototype.setValores = function(exp,cas, def) {
	Selecciona.prototype.expresion= exp;
	Selecciona.prototype.casos= cas;
	Selecciona.prototype.defecto= def;

};

Selecciona.prototype.getExpresion= function(){
	return Selecciona.prototype.expresion;
};

Selecciona.prototype.getCasos= function(){
	return Selecciona.prototype.casos;
};

Selecciona.prototype.getDefecto= function(){
	return Selecciona.prototype.defecto;
};
