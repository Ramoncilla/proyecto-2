function Nulo(){
	this.valorNulo = "nada";
}



Nulo.prototype.setNulo = function() {
	 this.valorNulo= "nada";

};

Nulo.prototype.getNulo= function(){
	return  this.valorNulo;
};

module.exports=Nulo;