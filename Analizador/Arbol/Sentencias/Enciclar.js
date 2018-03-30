function Enciclar(){
	this.id = null;
	this.cuerpo=[];
}
Enciclar.prototype.id=null;
Enciclar.prototype.cuerpo=[];


Enciclar.prototype.setValores = function(exp, sent) {
	Enciclar.prototype.id= exp;
	Enciclar.prototype.cuerpo= sent;

};

Enciclar.prototype.getId= function(){
	return Enciclar.prototype.id;
};

Enciclar.prototype.getCuerpo= function(){
	return Enciclar.prototype.cuerpo;
};
