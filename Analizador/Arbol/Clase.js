var Atributo = require("./Atributo");
var Funcion = require("./Funciones/Funcion");
var Constructor = require("./Funciones/Constructor");
var Principal= require("./Funciones/Principal");
var Parametro = require("./Funciones/Parametro");
var AsignaDecla = require("./Sentencias/AsignaDecla");
var DeclaArreglo = require("./Sentencias/DeclaArreglo");
var DeclaAsignaPuntero = require("./Sentencias/DeclaAsignaPuntero");
var DeclaCola = require("./Sentencias/DeclaCola");
var DeclaPila = require("./Sentencias/DeclaPila");
var DeclaLista = require("./Sentencias/DeclaLista");
var DeclaPuntero= require("./Sentencias/DeclaPuntero");
var DeclaVariable = require("./Sentencias/DeclaVariable");
var Simbolo = require("../Codigo3D/Simbolo");
var arreglo = require("./arreglo");


function Clase(){
	this.nombre ="";
	this.herencia = "";
	this.sentencias=[];
	this.funciones =[];
	this.principal_met=null;
	this.atributos=[];
}

Clase.prototype.nombre="";
Clase.prototype.herencia="";
Clase.prototype.sentencias=[];
Clase.prototype.funciones=[];
Clase.prototype.principal_met=null;
Clase.prototype.atributos=[];



Clase.prototype.setValores = function(nombre, here, sent) {
	Clase.prototype.nombre= nombre;
	Clase.prototype.herencia= here;
	Clase.prototype.sentencias=sent;//.getLista();
     for(var i =0; i<Clase.prototype.sentencias.length; i++){
		 var temp= Clase.prototype.sentencias[i];
		 if(temp instanceof Atributo){
			 console.log("Atributo :(  "+ temp.getVisibilidad());
		 }
	 }

	Clase.prototype.iniciarValores();
};


Clase.prototype.iniciarValores = function() {
	
Clase.prototype.funciones=[];
Clase.prototype.atributos=[];
Clase.prototype.principal_met=null;
var temporal;
	for (var i = 0; i < Clase.prototype.sentencias.length; i++) {
	 	temporal = Clase.prototype.sentencias[i];
	 	if(temporal instanceof Atributo){
	 		Clase.prototype.atributos.push(temporal);
	 	}

	 	if((temporal instanceof Funcion) ||
	 		(temporal instanceof Constructor))
	 	{
	 		Clase.prototype.funciones.push(temporal);
	 	}

	 	if(temporal instanceof Principal){
	 		Clase.prototype.principal_met= temporal;
	 	}
	 } 
};


Clase.prototype.getNombre= function(){
	return Clase.prototype.nombre;
};


Clase.prototype.getHerencia= function(){
	return Clase.prototype.herencia;
};


Clase.prototype.getSentencias= function(){
	return Clase.prototype.sentencias;
};

Clase.prototype.getSimbolosClase = function() {
	// body...
};

Clase.prototype.generarSimbolosAtributos = function() {
	var apuntador=0;
	var listaRetorno=[];
    var temporal, tipoDeclaracion;
	for (var i = 0; i < Clase.prototype.atributos.length; i++) {
		temporal = Clase.prototype.atributos[i];
		var declaracionAtributo = temporal.getDecla();
		var visibilidadAtributo = temporal.getVisibilidad();
		console.log(visibilidadAtributo +"visiiii");
		tipoDeclaracion= Clase.prototype.obtenerTipoDeclaracion(declaracionAtributo);
			 switch(tipoDeclaracion) {
				    
				    case 1: //asignaDecla
				    	var declaracionElemento = declaracionAtributo.getDecla();
				    	var enteroDecla = Clase.prototype.obtenerTipoDeclaracion(declaracionElemento);

				    	if(enteroDecla == 8){
				    		//puede ser una variable o un objeto con instancia
				    		var nombreC= declaracionElemento.getNombre();
				    		var tipoElemento = declaracionElemento.getTipo();
				    		var tipoSimb = Clase.prototype.obtenerTipoSimbolo(tipoElemento);
				    		var nuevoSimbolo= new Simbolo();
				    		nuevoSimbolo.setValoresVariable(nombreC, tipoSimb,tipoElemento,Clase.prototype.nombre,"ATRIBUTO",apuntador,1);
				    		var asignacion = declaracionElemento.getAsigna();
				    		var expresion = asignacion.getValor();
				    		nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				    		nuevoSimbolo.setExpresionAtributo(expresion);
				    		listaRetorno.push(nuevoSimbolo);
				    		apuntador++;

				    	}else if(enteroDecla == 2){
				    		//es un arreglo
				    		var nombreArreglo = declaracionElemento.getNombre();
				    		var tipoArreglo = declaracionElemento.getTipo();
				    		var dimensionesArreglo = declaracionElemento.getDimension();
				    		var noDim= dimensionesArreglo.length;
				    		var nuevoSimbolo= new Simbolo();
				    		nuevoSimbolo.setValoresArreglo(nombreArreglo,"ARREGLO",tipoArreglo,Clase.prototype.nombre,"ATRIBUTO",apuntador,1,noDim,dimensionesArreglo);
				    		var asignacion = declaracionElemento.getAsigna();
				    		var expresion = asignacion.getValor();
				    		nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				    		nuevoSimbolo.setExpresionAtributo(expresion);
				    		listaRetorno.push(nuevoSimbolo);
				    		apuntador++;
				    	}

				    	break;


				    case 2: //decla arreglo
						var nombreArreglo = declaracionAtributo.getNombre();
						var tipoArreglo = declaracionAtributo.getTipo();
						var dimensionesArreglo = declaracionAtributo.getDimension();
						var noDim = dimensionesArreglo.length;
						var nuevoSimbolo = new Simbolo();
						nuevoSimbolo.setValoresArreglo(nombreArreglo, "ARREGLO", tipoArreglo,Clase.prototype.nombre,"ATRIBUTO",apuntador,1,noDim,dimensionesArreglo);
						nuevoSimbolo.setVisibilidad(visibilidadAtributo);
						listaRetorno.push(nuevoSimbolo);
						apuntador++;
				    	break;

				    case 3:

				    	break;

				    case 4: //cola
				    	var nombreCola = declaracionAtributo.getNombre();
				    	var tipoCola = declaracionAtributo.getTipo();
				    	var nuevoSimbolo = new Simbolo();
				    	nuevoSimbolo.setValoresCola(nombreCola, "COLA", tipoCola, Clase.prototype.nombre, "ATRIBUTO",apuntador, 1);
				    	nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				    	listaRetorno.push(nuevoSimbolo);
				    	apuntador++;
				    	break;

				    case 5: //lista
				    	var nombreLista = declaracionAtributo.getNombre();
				    	var tipoLista = declaracionAtributo.getTipo();
				    	var nuevoSimbolo = new Simbolo();
				    	nuevoSimbolo.setValoresLista(nombreLista,"LISTA",tipoLista,Clase.prototype.nombre,"ATRIBUTO",apuntador,1);
				    	nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				    	listaRetorno.push(nuevoSimbolo);
				    	apuntador++;
				    	break;

				    case 6: //pila
				    	var nombrePila = declaracionAtributo.getNombre();
				    	var tipoPila = declaracionAtributo.getTipo();
				    	var nuevoSimbolo = new Simbolo();
				    	nuevoSimbolo.setValoresPila(nombrePila, "PILA",tipoPila,Clase.prototype.nombre, "ATRIBUTO",apuntador, 1);
				    	nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				    	listaRetorno.push(nuevoSimbolo);
				    	apuntador++;
				    	break;

				    case 7: //decla puntero
				    	var puntero = declaracionAtributo.getPuntero();
				    	var nombrePuntero = puntero.getNombrePuntero();
				    	var tipoPuntero = puntero.getTipoPuntero();
				    	var nuevoSimbolo= new Simbolo();
				    	nuevoSimbolo.setValoresPuntero(nombrePuntero,"PUNTERO",tipoPuntero,Clase.prototype.nombre,"ATRIBUTO",apuntador, 1);
				    	nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				    	listaRetorno.push(nuevoSimbolo);
				    	apuntador++;
				    	break;

				    case 8: //decla varaible
				        var nombreC= declaracionAtributo.getNombre();
				        var tipoVar= declaracionAtributo.getTipo();
				        var tipoSimb= Clase.prototype.obtenerTipoSimbolo(tipoVar);
				        var nuevoSimbolo= new Simbolo();
				        nuevoSimbolo.setValoresVariable(nombreC, tipoSimb,tipoVar, Clase.prototype.nombre,"ATRIBUTO",apuntador,1);
				        nuevoSimbolo.setVisibilidad(visibilidadAtributo);
				        listaRetorno.push(nuevoSimbolo);
				        apuntador++;
				        break;
				} 

	}


	return listaRetorno;
};




Clase.prototype.obtenerTipoSimbolo = function(tipo) {

	var tipoM= tipo.toUpperCase();

	if(tipoM =="ENTERO" ||
		tipoM =="CARACTER" ||
		tipoM == "DECIMAL" ||
		tipoM  =="BOOLEANO"){
		return "VARIABLE";
	}
	else{
		return "OBJETO";
	}
};


Clase.prototype.obtenerTipoDeclaracion = function(decla) {

	if(decla instanceof AsignaDecla){
		return 1;
	}
	
	if(decla instanceof DeclaArreglo){
		return 2;
	}

	if(decla instanceof DeclaAsignaPuntero){
		return 3;
	}

	if(decla instanceof DeclaCola){
		return 4;
	}

	if(decla instanceof DeclaLista){
		return 5;
	}

	if(decla instanceof DeclaPila){
		return 6;
	}

	if(decla instanceof DeclaPuntero){
		return 7;
	}

	if(decla instanceof DeclaVariable){
		return 8;
	}



};

module.exports=Clase;


