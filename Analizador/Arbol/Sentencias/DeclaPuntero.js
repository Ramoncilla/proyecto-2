function DeclaPuntero(){
	this.puntero = null;
}



DeclaPuntero.prototype.setValores = function(p) {
	this.puntero= p;
};



DeclaPuntero.prototype.getPuntero= function(){
	return this.puntero;
};


module.exports=DeclaPuntero;
