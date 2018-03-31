function DeclaCola(){
	this.tipoCola ="";
	this.nombreCola = "";
}



DeclaCola.prototype.setValores = function(nombre, tipo) {
	this.tipoCola= tipo;
	this.nombreCola= nombre;

};

DeclaCola.prototype.getTipo= function(){
	return this.tipoCola;
};


DeclaCola.prototype.getNombre= function(){
	return this.nombreCola;
};
module.exports=DeclaCola;