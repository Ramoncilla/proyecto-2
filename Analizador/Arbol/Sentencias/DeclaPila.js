function DeclaPila(){
	this.tipoPila ="";
	this.nombrePila = "";
}
DeclaPila.prototype.tipoPila="";
DeclaPila.prototype.nombrePila="";


DeclaPila.prototype.setValores = function(nombre, tipo) {
	DeclaPila.prototype.tipoPila= tipo;
	DeclaPila.prototype.nombrePila= nombre;

};

DeclaPila.prototype.getTipo= function(){
	return DeclaPila.prototype.tipoPila;
};


DeclaPila.prototype.getNombre= function(){
	return DeclaPila.prototype.nombrePila;
};
