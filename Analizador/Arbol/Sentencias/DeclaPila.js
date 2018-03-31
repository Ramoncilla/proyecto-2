function DeclaPila(){
	this.tipoPila ="";
	this.nombrePila = "";
}



DeclaPila.prototype.setValores = function(nombre, tipo) {
	this.tipoPila= tipo;
	this.nombrePila= nombre;

};

DeclaPila.prototype.getTipo= function(){
	return this.tipoPila;
};


DeclaPila.prototype.getNombre= function(){
	return this.nombrePila;
};
module.exports=DeclaPila;