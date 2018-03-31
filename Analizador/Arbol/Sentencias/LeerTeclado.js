
function LeerTeclado(){
	this.expresionCadena = null;
	this.nombreVarible="";
}



LeerTeclado.prototype.setValores = function(expresion, id) {
	this.expresionCadena= expresion;
	this.nombreVariable= id;

};

LeerTeclado.prototype.getNombre= function(){
	return this.nombreVariable;
};

LeerTeclado.prototype.getExpresion= function(){
	return this.expresionCadena;
};
module.exports=LeerTeclado;




