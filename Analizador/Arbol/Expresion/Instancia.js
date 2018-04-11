function Instancia(){
	this.tipoObjeto ="";
	this.parametrosInstancia=[];
}


  
Instancia.prototype.setValores = function(tipo, parametros) {
	this.tipoObjeto= tipo;
	this.parametrosInstancia=parametros;

};

Instancia.prototype.getTipo= function(){
	return this.tipoObjeto;
};



Instancia.prototype.getParametros= function(){
	return this.parametrosInstancia;
};

module.exports=Instancia;