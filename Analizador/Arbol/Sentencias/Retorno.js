function Retorno(){
	this.expresionRetorno = null;
}



Retorno.prototype.setExpresion = function(exp) {
	this.expresionRetorno= exp;
};


Retorno.prototype.getExpresion= function(){
	return this.expresionRetorno;
};
module.exports=Retorno;