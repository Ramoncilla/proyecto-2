
function LeerTeclado(){
	this.expresionCadena = null;
	this.nombreVarible="";
}
LeerTeclado.prototype.expresionCadena=null;
LeerTeclado.prototype.nombreVarible="";


LeerTeclado.prototype.setValores = function(expresion, id) {
	LeerTeclado.prototype.expresionCadena= expresion;
	LeerTeclado.prototype.nombreVarible= id;

};

LeerTeclado.prototype.getNombre= function(){
	return LeerTeclado.prototype.nombreVarible;
};

LeerTeclado.prototype.getExpresion= function(){
	return LeerTeclado.prototype.expresionCadena;
};




