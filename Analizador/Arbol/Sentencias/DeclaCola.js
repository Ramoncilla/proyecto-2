function DeclaCola(){
	this.tipoLista ="";
	this.nombreLista = "";
}
 
 

DeclaCola.prototype.setValores = function(nombre, tipo) {
	this.tipoLista= tipo;
	this.nombreLista= nombre;

};

DeclaCola.prototype.getTipo= function(){
	return this.tipoLista;
};


DeclaCola.prototype.getNombre= function(){
	return this.nombreLista;
};
module.exports=DeclaCola;