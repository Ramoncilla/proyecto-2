function Codigo(){
	this.codigo3D="";
	this.contEtiquetas=0;
	this.contTemporales=0;
}

Codigo.prototype.codigo3D="";
Codigo.prototype.contEtiquetas=0;
Codigo.prototype.contTemporales=0;


Codigo.prototype.getEtiqueta = function() {
	// body...
	Codigo.prototype.contEtiquetas++;
	return "L"+Codigo.prototype.contEtiquetas;
};

Codigo.prototype.getTemporal = function() {
	// body...
	Codigo.prototype.contTemporales++;
	return "t"+Codigo.prototype.contTemporales;
};

Codigo.prototype.addCodigo = function(val) {
	// body...
	Codigo.prototype.codigo3D+=val+"\n";
};