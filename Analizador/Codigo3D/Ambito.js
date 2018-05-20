function Ambito(){
	this.ambitos =[];
	this.valEstructura=0;
	this.valSi=0;
	this.valElse=0;
	this.valCaso=0;
	this.valDefecto=0;
	this.valRepetirMientras=0;
	this.valHacerMientras=0;
	this.valCicloX=0;
	this.valRepetir=0;
	this.valRepetirContando=0;
	this.valEnciclar=0;
	this.valContador=0;
}




Ambito.prototype.inciarValores = function(){
	this.ambitos =[];
	this.valEstructura=0;
	this.valSi=0;
	this.valElse=0;
	this.valCaso=0;
	this.valDefecto=0;
	this.valRepetirMientras=0;
	this.valHacerMientras=0;
	this.valCicloX=0;
	this.valRepetir=0;
	this.valRepetirContando=0;
	this.valEnciclar=0;
	this.valContador=0;

};

Ambito.prototype.setAmbitos = function(arr){
	this.ambitos=arr;
};

Ambito.prototype.addAmbito= function(ambi){
	this.ambitos.unshift(ambi);
};

Ambito.prototype.addEstructura = function() {
	this.valEstructura++;
	this.ambitos.unshift("ESTRUCTURA"+this.valEstructura);
};
 
Ambito.prototype.addSi = function() {
	this.valSi++;
	this.ambitos.unshift("SI"+this.valSi);
};

Ambito.prototype.addElse = function() {
	this.valElse++;
	this.ambitos.unshift("ELSE");
};

 
Ambito.prototype.addCaso = function() {
	this.valCaso++;
	this.ambitos.unshift("CASO"+this.valCaso);
};


Ambito.prototype.addDefecto = function() {
	this.valDefecto++;
	this.ambitos.unshift("DEFECTO"+this.valDefecto);
};


  
Ambito.prototype.addRepetirMientras = function() {
	this.valRepetirMientras++;
	this.ambitos.unshift("REPETIR_MIENTRAS"+this.valRepetirMientras);
};


Ambito.prototype.addHacerMientras = function() {
	this.valHacerMientras++;
	this.ambitos.unshift("HACER_MIENTRAS"+this.valHacerMientras);
};

 
Ambito.prototype.addCicloX= function() {
	this.valCicloX++;
	this.ambitos.unshift("CICLO_X"+this.valCicloX);
};


Ambito.prototype.addRepetir = function() {
	this.valRepetir++;
	this.ambitos.unshift("REPETIR"+this.valRepetir);
};


Ambito.prototype.addRepetirContando = function() {
	this.valRepetirContando++;
	this.ambitos.unshift("REPETIR_CONTANDO"+this.valRepetirContando);
};

Ambito.prototype.addEnciclar= function() {
	this.valEnciclar++;
	this.ambitos.unshift("ENCICLAR"+this.valEnciclar);
};

Ambito.prototype.addContador = function() {
	this.valContador++;
	this.ambitos.unshift("CONTADOR"+this.valContador);
};

Ambito.prototype.getAmbitos= function(){
	var contexto ="";
	var valTemporal;
	for(var i =this.ambitos.length-1; i>=0;i--){
		valTemporal= this.ambitos[i];
		if(i==0){
			contexto +=valTemporal;
		}else{
			contexto+=valTemporal+"_";
		}
	}
   
	return contexto;

};


module.exports=Ambito;