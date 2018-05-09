var posArreglo = require("../Expresion/PosArreglo");
var elementoId = require("../Expresion/t_id");

function Parametro(){
	this.tipoParametro ="";
	this.pasoParametro=0; //1 valor 2 referencia
	this.objetoParametro = null;
}

Parametro.prototype.setValores = function(tipo,paso,objeto) {
	this.tipoParametro= tipo;
	this.objetoParametro= objeto;
	this.pasoParametro=paso;

};

Parametro.prototype.getPaso= function(){
	if(this.pasoParametro==2){
		return "SI";
	}else{
		return "NO";
	}
};

Parametro.prototype.getTipo= function(){
	return this.tipoParametro;
};

Parametro.prototype.obtenerObjetoParametro = function(){
	return this.objetoParametro;
};

Parametro.prototype.getNombre= function(){
    if(this.objetoParametro instanceof elementoId){
		return this.objetoParametro.getValorId();
	}else{
		return this.objetoParametro.nombreArreglo;
	}
};

module.exports=Parametro;