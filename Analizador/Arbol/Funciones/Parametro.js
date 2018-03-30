function Parametro(){
	this.tipoParametro ="";
	this.pasoParametro=0; //1 valor 2 referencia
	this.nombreParametro = "";
}

Parametro.prototype.tipoParametro="";
Parametro.prototype.nombreParametro="";
Parametro.prototype.pasoParametro=0;


Parametro.prototype.setValores = function(tipo,paso,nombre) {
	Parametro.prototype.tipoParametro= tipo;
	Parametro.prototype.nombreParametro= nombre;
	Parametro.prototype.pasoParametro=paso;

};

Parametro.prototype.getPaso= function(){
	return Parametro.prototype.pasoParametro;
};


Parametro.prototype.getTipo= function(){
	return Parametro.prototype.tipoParametro;
};


Parametro.prototype.getNombre= function(){
	return Parametro.prototype.nombreParametro;
};

