function DeclaCola(){
	this.tipoCola ="";
	this.nombreCola = "";
}
DeclaCola.prototype.tipoCola="";
DeclaCola.prototype.nombreCola="";


DeclaCola.prototype.setValores = function(nombre, tipo) {
	DeclaCola.prototype.tipoCola= tipo;
	DeclaCola.prototype.nombreCola= nombre;

};

DeclaCola.prototype.getTipo= function(){
	return DeclaCola.prototype.tipoCola;
};


DeclaCola.prototype.getNombre= function(){
	return DeclaCola.prototype.nombreCola;
};
