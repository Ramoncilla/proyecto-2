function DeclaLista(){
	this.tipoLista ="";
	this.nombreLista = "";
}
DeclaLista.prototype.tipoLista="";
DeclaLista.prototype.nombreLista="";


DeclaLista.prototype.setValores = function(nombre, tipo) {
	DeclaLista.prototype.tipoLista= tipo;
	DeclaLista.prototype.nombreLista= nombre;

};

DeclaLista.prototype.getTipo= function(){
	return DeclaLista.prototype.tipoLista;
};


DeclaLista.prototype.getNombre= function(){
	return DeclaLista.prototype.nombreLista;
};

