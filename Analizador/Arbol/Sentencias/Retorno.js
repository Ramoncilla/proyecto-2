function Retorno(){
	this.expresionRetorno = null;
}
Retorno.prototype.expresionRetorno=null;


Retorno.prototype.setExpresion = function(exp) {
	Retorno.prototype.expresionRetorno= exp;
};


Retorno.prototype.getExpresion= function(){
	return Retorno.prototype.expresionRetorno;
};
