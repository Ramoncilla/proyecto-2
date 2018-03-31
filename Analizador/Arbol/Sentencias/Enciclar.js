function Enciclar(){
	this.id = null;
	this.cuerpo=[];
}



Enciclar.prototype.setValores = function(exp, sent) {
	this.id= exp;
	this.cuerpo= sent;

};

Enciclar.prototype.getId= function(){
	return this.id;
};

Enciclar.prototype.getCuerpo= function(){
	return this.cuerpo;
};

module.exports=Enciclar;