function DeclaPila(){
	this.tipoLista ="";
	this.nombreLista = "";
}

   

DeclaPila.prototype.setValores = function(nombre, tipo) {
	this.tipoLista= tipo;
	this.nombreLista= nombre;

};

DeclaPila.prototype.getTipo= function(){
	return this.tipoLista;
};


DeclaPila.prototype.getNombre= function(){
	return this.nombreLista;
};
module.exports=DeclaPila;