function DeclaPuntero(){
	this.puntero = null;
}

DeclaPuntero.prototype.puntero=null;

DeclaPuntero.prototype.setValores = function(p) {
	DeclaPuntero.prototype.puntero= p;
};



DeclaPuntero.prototype.getPuntero= function(){
	return DeclaPuntero.prototype.puntero;
};



