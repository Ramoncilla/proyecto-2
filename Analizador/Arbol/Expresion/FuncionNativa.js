
function FuncionNativa(){

	this.nombreFuncion="";
	this.expresion =null;
}



FuncionNativa.prototype.setValores= function(nombre, exp) {
	// body...
	this.nombreFuncion = nombre;
	this.expresion=exp;
};


FuncionNativa.prototype.getNombreFuncion = function() {
	return this.nombreFuncion;
	// body...
};


FuncionNativa.prototype.getExpresion = function() {
	return this.expresion;
	// body...
};

module.exports=FuncionNativa;

