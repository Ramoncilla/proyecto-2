function Instancia(){
	this.tipoObjeto ="";
	this.nombreInstancia = "";
	this.parametrosInstancia=[];
}




Instancia.prototype.setValores = function(tipo, nombre, parametros) {
	this.tipoObjeto= tipo;
	this.nombreInstancia = nombre;
	this.parametrosInstancia=parametros;

};

Instancia.prototype.getTipo= function(){
	return Instancia.prototype.tipoInstancia;
};


Instancia.prototype.getNombre= function(){
	return this.nombreInstancia ;
};


Instancia.prototype.getParametros= function(){
	return this.parametrosInstancia;
};

module.exports=Instancia;