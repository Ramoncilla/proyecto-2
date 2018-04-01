function Parametro(){
	this.tipoParametro ="";
	this.pasoParametro=0; //1 valor 2 referencia
	this.nombreParametro = "";
}




Parametro.prototype.setValores = function(tipo,paso,nombre) {
	this.tipoParametro= tipo;
	this.nombreParametro= nombre;
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


Parametro.prototype.getNombre= function(){
	return this.nombreParametro;
};

module.exports=Parametro;