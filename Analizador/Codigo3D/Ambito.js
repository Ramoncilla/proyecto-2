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


    Ambito.prototype.ambitos =[];
	Ambito.prototype.valEstructura=0;
	Ambito.prototype.valSi=0;
	Ambito.prototype.valElse=0;
	Ambito.prototype.valCaso=0;
	Ambito.prototype.valDefecto=0;
	Ambito.prototype.valRepetirMientras=0;
	Ambito.prototype.valHacerMientras=0;
	Ambito.prototype.valCicloX=0;
	Ambito.prototype.valRepetir=0;
	Ambito.prototype.valRepetirContando=0;
	Ambito.prototype.valEnciclar=0;
	Ambito.prototype.valContador=0;


Ambito.prototype.addEstructura = function() {
	Ambito.prototype.valEstructura++;
	Ambito.prototype.ambitos.push("ESTRUCTURA"+Ambito.prototype.valEstructura);
};

Ambito.prototype.addSi = function() {
	Ambito.prototype.valSi++;
	Ambito.prototype.ambitos.push("SI"+Ambito.prototype.valSi);
};

Ambito.prototype.addElse = function() {
	Ambito.prototype.valElse++;
	Ambito.prototype.ambitos.push("ELSE"+Ambito.prototype.valElse);
};


Ambito.prototype.addCaso = function() {
	Ambito.prototype.valCaso++;
	Ambito.prototype.ambitos.push("CASO"+Ambito.prototype.valCaso);
};


Ambito.prototype.addDefecto = function() {
	Ambito.prototype.valDefecto++;
	Ambito.prototype.ambitos.push("DEFECTO"+Ambito.prototype.valDefecto);
};



Ambito.prototype.addRepetirMientras = function() {
	Ambito.prototype.valMientras++;
	Ambito.prototype.ambitos.push("REPETIR_MIENTRAS"+Ambito.prototype.valMientras);
};


Ambito.prototype.addHacerMientras = function() {
	Ambito.prototype.valHacerMientras++;
	Ambito.prototype.ambitos.push("HACER_MIENTRAS"+Ambito.prototype.valHacerMientras);
};


Ambito.prototype.addCicloX= function() {
	Ambito.prototype.valCicloX++;
	Ambito.prototype.ambitos.push("CICLO_X"+Ambito.prototype.valCicloX);
};


Ambito.prototype.addRepetir = function() {
	Ambito.prototype.valRepetir++;
	Ambito.prototype.ambitos.push("REPETIR"+Ambito.prototype.valRepetir);
};


Ambito.prototype.addRepetirContando = function() {
	Ambito.prototype.valRepetirContando++;
	Ambito.prototype.ambitos.push("REPETIR_CONTANDO"+Ambito.prototype.valRepetirContando);
};

Ambito.prototype.addEnciclar= function() {
	Ambito.prototype.valEnciclar++;
	Ambito.prototype.ambitos.push("ENCICLAR"+Ambito.prototype.valEnciclar);
};

Ambito.prototype.addContador = function() {
	Ambito.prototype.valContador++;
	Ambito.prototype.ambitos.push("CONTADOR"+Ambito.prototype.valContador);
};

