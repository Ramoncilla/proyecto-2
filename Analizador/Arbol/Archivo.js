function Archivo(){
	this.sentencias =[];

}


Archivo.prototype.setValores = function(sent) {
	this.sentencias=sent;

};


Archivo.prototype.getSentencias = function() {
	// body...
	return this.sentencias;
};

module.exports=Archivo;
