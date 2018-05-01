function DeclaLista(){
	this.tipoLista ="";
	this.nombreLista = "";
} 

 
DeclaLista.prototype.setValores = function(nombre, tipo) {
	this.tipoLista= tipo;
	this.nombreLista= nombre;

};

DeclaLista.prototype.getTipo= function(){
	return this.tipoLista;
};


DeclaLista.prototype.getNombre= function(){
	return this.nombreLista;
};

module.exports=DeclaLista;