
function t_id(){
	this.nombreId="";
}

t_id.prototype.nombreId="";


t_id.prototype.setValorId = function(valor) {
	// body...
	t_id.prototype.nombreId=valor;
};

t_id.prototype.getValorId = function() {
	// body...
	return t_id.prototype.nombreId;
};




