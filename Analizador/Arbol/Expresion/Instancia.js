function Instancia(){
	this.tipoObjeto ="";
	this.nombreInstancia = "";
	this.parametrosInstancia=[];
}

Instancia.prototype.tipoObjeto="";
Instancia.prototype.nombreInstancia="";
Instancia.prototype.parametrosInstancia=[];


Instancia.prototype.setValores = function(tipo, nombre, parametros) {
	Instancia.prototype.tipoObjeto= tipo;
	Instancia.prototype.nombreInstancia= nombre;
	Instancia.prototype.parametrosInstancia=parametros;

};

Instancia.prototype.getTipo= function(){
	return Instancia.prototype.tipoInstancia;
};


Instancia.prototype.getNombre= function(){
	return Instancia.prototype.nombreInstancia;
};


Instancia.prototype.getParametros= function(){
	return Instancia.prototype.parametrosInstancia;
};

