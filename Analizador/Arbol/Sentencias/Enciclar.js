var romper = require("./Romper");


function Enciclar(){
	this.id = null;
	this.cuerpo=[];
}


Enciclar.prototype.esValido = function(){
	var sentTemporal;
	var resultado= false;
	for(var i = 0; i< this.cuerpo.length; i++){
		sentTemporal = this.cuerpo[i];
		if(sentTemporal instanceof romper){
			resultado = true;
		}
	}
	return resultado;
};
 
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