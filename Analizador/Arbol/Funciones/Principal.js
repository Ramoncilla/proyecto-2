function Principal(){
	this.sentencias =[];

}




Principal.prototype.setValores = function(sent) {
	this.sentencias=sent;

}; 


Principal.prototype.getSentencias = function() {
	// body...
	return this.sentencias;
};
module.exports=Principal;