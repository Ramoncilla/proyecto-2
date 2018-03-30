function Principal(){
	this.sentencias =[];

}

Principal.prototype.sentencias=[];


Principal.prototype.setValores = function(sent) {
	Principal.prototype.sentencias=sent;

};


Principal.prototype.getSentencias = function() {
	// body...
	return Principal.prototype.sentencias;
};