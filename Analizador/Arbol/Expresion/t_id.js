
function t_id(){
	this.nombreId="";
}


  

t_id.prototype.setValorId = function(valor) {
	// body...
	this.nombreId=valor;
};

t_id.prototype.getValorId = function() {
	// body...
	return this.nombreId;
};




module.exports=t_id;