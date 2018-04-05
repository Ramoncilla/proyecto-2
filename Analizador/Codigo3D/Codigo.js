function Codigo(){
	this.codigo3D="";
	this.contEtiquetas=0;
	this.contTemporales=0;
}

Codigo.prototype.getEtiqueta = function() {
	// body...
	this.contEtiquetas++;
	return "L"+this.contEtiquetas;
};

Codigo.prototype.getTemporal = function() {
	// body...
	this.contTemporales++;
	return "t"+this.contTemporales;
};

Codigo.prototype.addCodigo = function(val) {
	// body...
	this.codigo3D+=val+"\n";
};

Codigo.prototype.getCodigo3D= function(){
	return this.codigo3D;
};

module.exports= Codigo;