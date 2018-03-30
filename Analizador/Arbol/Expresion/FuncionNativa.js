
function FuncionNativa(){

	this.nombreFuncion="";
	this.expresion =null;
}


FuncionNativa.prototype.nombreFuncion="";
FuncionNativa.prototype.expresion=null;



FuncionNativa.prototype.setValores= function(nombre, exp) {
	// body...
	FuncionNativa.prototype.nombreFuncion = nombre;
	FuncionNativa.prototype.expresion=exp;
};


FuncionNativa.prototype.getNombreFuncion = function() {
	return FuncionNativa.prototype.nombreFuncion;
	// body...
};


FuncionNativa.prototype.getExpresion = function() {
	return FuncionNativa.prototype.expresion;
	// body...
};

