function Archivo(){
	this.sentencias =[];

}

Archivo.prototype.sentencias=[];


Archivo.prototype.setValores = function(sent) {
	Archivo.prototype.sentencias=sent;

};


Archivo.prototype.getSentencias = function() {
	// body...
	return Archivo.prototype.sentencias;
};

module.exports=Archivo;