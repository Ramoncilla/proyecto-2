var Atributo = require("./Atributo");
var Funcion = require("./Funciones/Funcion");
var Constructor = require("./Funciones/Constructor");
var Principal = require("./Funciones/Principal");
var Parametro = require("./Funciones/Parametro");
var AsignaDecla = require("./Sentencias/AsignaDecla");
var DeclaArreglo = require("./Sentencias/DeclaArreglo");
var DeclaAsignaPuntero = require("./Sentencias/DeclaAsignaPuntero");
var DeclaCola = require("./Sentencias/DeclaCola");
var DeclaPila = require("./Sentencias/DeclaPila");
var DeclaLista = require("./Sentencias/DeclaLista");
var DeclaPuntero = require("./Sentencias/DeclaPuntero");
var DeclaVariable = require("./Sentencias/DeclaVariable");
var Simbolo = require("../Codigo3D/Simbolo");
var listaFunciones = require("./listaFunciones");
var Ambito = require("../Codigo3D/Ambito");
var Error = require("../Errores/Error");
var listaErrores = require("../Errores/listaErrores");

var Caso = require("../Arbol/Sentencias/Caso");
var Ciclo_X= require("../Arbol/Sentencias/Ciclo_X");
var Contador = require("../Arbol/Sentencias/Contador");
var Enciclar = require("../Arbol/Sentencias/Enciclar");
var Estructura = require("../Arbol/Sentencias/Estructura");
var Hacer_Mientras = require("../Arbol/Sentencias/Hacer_Mientras");
var Repetir_Contando = require("../Arbol/Sentencias/Repetir_Contando");
var Repetir_Mientras = require("../Arbol/Sentencias/Repetir_Mientras");
var Repetir = require("../Arbol/Sentencias/Repetir");
var Selecciona = require("../Arbol/Sentencias/Selecciona");
var Si = require("../Arbol/Sentencias/Si");


var lErrores = new listaErrores();
var apuntador = 0;
var lista2=[];
function Clase() {
    this.nombre = "";
    this.herencia = "";
    this.sentencias = [];
    this.funciones =new listaFunciones();
    this.principal_met = null;
    this.atributos = [];
}


Clase.prototype.setValores = function(nombre, here, sent) {
	this.funciones= new listaFunciones();
    this.nombre = nombre;
    this.herencia = here;
    this.sentencias = sent;
    this.iniciarValores();
};


Clase.prototype.iniciarValores = function() {

    this.funciones = new listaFunciones();
    this.atributos = [];
    this.principal_met = null;
    var temporal;
    if (this.sentencias != null) {
        for (var i = 0; i < this.sentencias.length; i++) {
            temporal = this.sentencias[i];
            if (temporal instanceof Atributo) {
                this.atributos.push(temporal);
            }

            if ((temporal instanceof Funcion)){ 
					temporal.setNombreClase(this.nombre);
					this.funciones.insertarFuncion(temporal);
					
            }

            if (temporal instanceof Principal) {
                this.principal_met = temporal;
            }
        }
    } else {
        lErrores.insertarError("Semantico","Hubo un error al crear el arbol de analisis");
        console.log("las senticas son nulas");
    }
};


Clase.prototype.insertarAtributoHeredado= function(atri){
    this.atributos.unshift(atri);
};

Clase.prototype.insertarFuncionHeredada= function(func){
    this.funciones.insertarFuncionHeredada(func, this.nombre);
};


Clase.prototype.obtenerAtributosValidosHerencia = function(){

    var retorno =[];
    var temporal;
    for(var i =0; i<this.atributos.length; i++){
        temporal = this.atributos[i];
        if(temporal.visibilidad.toUpperCase() == "PUBLICO"){
            retorno.push(temporal);
        } 
    }
    return retorno;
};

Clase.prototype.obtenerFuncionesValidasHerencia = function(){
    
    return this.funciones.obtenerFuncionesPublicas();
    
};



Clase.prototype.getNombre = function() {
    return this.nombre;
};


Clase.prototype.getHerencia = function() {
    return this.herencia;
};


Clase.prototype.getSentencias = function() {
    return this.sentencias;
};


Clase.prototype.generarSimbolosAtributos = function() {
    var listaRetorno = [];
    var temporal, tipoDeclaracion;
    for (var i = 0; i < this.atributos.length; i++) {
        temporal = this.atributos[i];
        var declaracionAtributo = temporal.getDecla();
        var visibilidadAtributo = temporal.getVisibilidad();
        tipoDeclaracion = this.obtenerTipoDeclaracion(declaracionAtributo);
        switch (tipoDeclaracion) {

            case 1: //asignaDecla
                var declaracionElemento = declaracionAtributo.getDecla();
                console.log("esteee ");
                console.dir(declaracionElemento);
                var enteroDecla = this.obtenerTipoDeclaracion(declaracionElemento);

                if (enteroDecla == 8) {
                    //puede ser una variable o un objeto con instancia
                    var nombreC = declaracionElemento.getNombre();

                    if (!(this.existeAtributo(listaRetorno, nombreC))) {
                        var tipoElemento = declaracionElemento.getTipo();
                        var tipoSimb = this.obtenerTipoSimbolo(tipoElemento);
                        var nuevoSimbolo = new Simbolo();
                        nuevoSimbolo.setValoresVariable(nombreC, tipoSimb, tipoElemento, this.nombre, "ATRIBUTO", apuntador, 1);
                        var asignacion = declaracionAtributo.getAsigna();
                        var expresion = asignacion.getValor();
                        nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                        nuevoSimbolo.setExpresionAtributo(expresion);
                        listaRetorno.push(nuevoSimbolo);
                        apuntador++;

                    } else {
                        lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreC);
						console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreC);
                    }
                } else if (enteroDecla == 2) {
                    //es un arreglo
                    var nombreArreglo = declaracionElemento.getNombre();

                    if (!(this.existeAtributo(listaRetorno, nombreArreglo))) {
                        var tipoArreglo = declaracionElemento.getTipo();
                        var dimensionesArreglo = declaracionElemento.getDimension();
                        var noDim = dimensionesArreglo.length;
                        var nuevoSimbolo = new Simbolo();
                        nuevoSimbolo.setValoresArreglo(nombreArreglo, "ARREGLO", tipoArreglo, this.nombre, "ATRIBUTO", apuntador, 1, noDim, dimensionesArreglo);
                        var asignacion = declaracionAtributo.getAsigna();
                        console.dir(declaracionAtributo);
                        console.log("aquiiii");
                        console.dir(asignacion); 
                        var expresion = asignacion.getValor();
                        nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                        nuevoSimbolo.setExpresionAtributo(expresion);
                        listaRetorno.push(nuevoSimbolo);
                        apuntador++;

                    } else {
                        lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreArreglo);
						console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreArreglo);
                    }


                }

                break;


            case 2: //decla arreglo
                var nombreArreglo = declaracionAtributo.getNombre();

                if (!(this.existeAtributo(listaRetorno, nombreArreglo))) {
                    var tipoArreglo = declaracionAtributo.getTipo();
                    var dimensionesArreglo = declaracionAtributo.getDimension();
                    var noDim = dimensionesArreglo.length;
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresArreglo(nombreArreglo, "ARREGLO", tipoArreglo, this.nombre, "ATRIBUTO", apuntador, 1, noDim, dimensionesArreglo);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreArreglo);
					console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreArreglo);
                }


                break;

            case 3:

                break;

            case 4: //cola
                var nombreCola = declaracionAtributo.getNombre();

                if (!(this.existeAtributo(listaRetorno, nombreCola))) {
                    var tipoCola = declaracionAtributo.getTipo();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresCola(nombreCola, "COLA", tipoCola, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreCola);
					console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreCola);
                }


                break;

            case 5: //lista
                var nombreLista = declaracionAtributo.getNombre();

                if (!(this.existeAtributo(listaRetorno, nombreLista))) {
                    var tipoLista = declaracionAtributo.getTipo();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresLista(nombreLista, "LISTA", tipoLista, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreLista);
					console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreLista);
                }


                break;

            case 6: //pila
                var nombrePila = declaracionAtributo.getNombre();
                if (!(this.existeAtributo(listaRetorno, nombrePila))) {
                    var tipoPila = declaracionAtributo.getTipo();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresPila(nombrePila, "PILA", tipoPila, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombrePila);
					console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombrePila);
                }



                break;

            case 7: //decla puntero
                var puntero = declaracionAtributo.getPuntero();
                var nombrePuntero = puntero.getNombrePuntero();
                if (!(this.existeAtributo(listaRetorno, nombrePuntero))) {
                    var tipoPuntero = puntero.getTipoPuntero();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresPuntero(nombrePuntero, "PUNTERO", tipoPuntero, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombrePuntero);
					console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombrePuntero);

                }

                break;

            case 8: //decla varaible
                var nombreC = declaracionAtributo.getNombre();
                if (!(this.existeAtributo(listaRetorno, nombreC))) {
                    var tipoVar = declaracionAtributo.getTipo();
                    var tipoSimb = this.obtenerTipoSimbolo(tipoVar);
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresVariable(nombreC, tipoSimb, tipoVar, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreC);
                    console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreC);
                }
                break;
        }

    }


    return listaRetorno;
};


Clase.prototype.existeAtributo = function(lista, nombre) {
    var simTemporal;
    for (var i = 0; i < lista.length; i++) {
        simTemporal = lista[i];
        if (simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()) {
            return true;
        }
    }
    return false;
};




Clase.prototype.generarSimbolosClase = function() {
    //agregar constructor por defecto

    //1. Crear el simbolo de la clase 
    var retornoSimbolos = [];
    var simbAtributos = this.generarSimbolosAtributos();
    var simbClase = new Simbolo();
    simbClase.setValoresVariable(this.nombre,"CLASE",this.nombre,"NO_TIENE","CLASE",-1,simbAtributos.length);
    retornoSimbolos.push(simbClase);
    /* 2. Agregar simbolos de los atributos  */
    for (var i = 0; i < simbAtributos.length; i++) {
        retornoSimbolos.push(simbAtributos[i]);
    }

	/*3 Generar Simbolo Funcion */
	var funTemporal;
	var simTemporal;
	var thisTemporal;
	var returnTemporal;
	var ambitos ;
    apuntador =0;

	for(var i = 0; i<this.funciones.funciones.length;i++){
		funTemporal = this.funciones.funciones[i];
		var noPametros =0;
        var banderaConstructor=funTemporal.esConstructor;
		ambitos = new Ambito();
		console.log(funTemporal.obtenerFirma());
		ambitos.addAmbito(funTemporal.obtenerFirma());
		apuntador=0;

		//creamos el this de la funcion
		thisTemporal= new Simbolo();
		thisTemporal.setValoresVariable("THIS","THIS","THIS",ambitos.getAmbitos(),"THIS",apuntador,1);
		apuntador++;


		  // Creamos parametros de la funcion

		  var simbParametros =[];
		  var simbTemporal;
          var parTemp;
          
		  for(var j = 0; j<funTemporal.parametros.parametros.length;j++){
			  noPametros++;
			  parTemp= funTemporal.parametros.parametros[j];
			  simbTemporal= new Simbolo();
			 // simbTemporal.setValoresVariable(parTemp.getNombre(),parTemp.getTipo(),this.obtenerTipoSimbolo(parTemp.getTipo()),ambitos.getAmbitos(),"PARAMETRO",apuntador,1);
              simbTemporal.setValoresVariable(parTemp.getNombre(),this.obtenerTipoSimbolo(parTemp.getTipo()),parTemp.getTipo(),ambitos.getAmbitos(),"PARAMETRO",apuntador,1);
              simbTemporal.setPasoReferencia(parTemp.getPaso());
			  apuntador++;
			  simbParametros.push(simbTemporal);

		  }
          //aqui se genera los simbolos de las sentencias de la funcion
          var sentFuncion = funTemporal.getSentencias();
          lista2=[];
          console.log("esta funcion tiene  "+ sentFuncion.length+" SENTENCIAS");
          this.obtenerSimbolosMetodo(sentFuncion,ambitos);
         



		  //creamos simbolo del return
		  returnTemporal= new Simbolo();
		  returnTemporal.setValoresVariable("RETORNO","RETORNO","RETORNO",ambitos.getAmbitos(),"RETORNO",apuntador,1);
		  apuntador++;

		  var sizeFun = 1+simbParametros.length+lista2.length+1;
		 
		//Simbolo.prototype.setValoresFuncion= function(nombreC, tipo, tipoS,ambito,rol,apuntador,tamanio,noPar,cadenParametros,nombreFun)
        simbTemporal = new Simbolo();
        
        if(!banderaConstructor){
            simbTemporal.setValoresFuncion(funTemporal.obtenerFirma(),funTemporal.getTipo(),"FUNCION",this.nombre,"FUNCION",-1,sizeFun,funTemporal.obtenerNoParametros(),funTemporal.obtenerCadenaParametros(), funTemporal.getNombreFuncion());
		var visiFuncion = funTemporal.getVisibilidad();
		simbTemporal.setVisibilidad(visiFuncion);

        }else{
            simbTemporal.setValoresFuncion(funTemporal.obtenerFirma(),funTemporal.getTipo(),"CONSTRUCTOR",this.nombre,"CONSTRUCTOR",-1,sizeFun,funTemporal.obtenerNoParametros(),funTemporal.obtenerCadenaParametros(), funTemporal.getNombreFuncion());
		var visiFuncion = funTemporal.getVisibilidad();
		simbTemporal.setVisibilidad(visiFuncion);

        }
		
        
        
        retornoSimbolos.push(simbTemporal);
		retornoSimbolos.push(thisTemporal);

		//insertamos parametros
		for(var j = 0; j<simbParametros.length;j++){
            if(!this.existeSimbolo(retornoSimbolos,simbParametros[j])){
                retornoSimbolos.push(simbParametros[j]);
            }
			
		}
        //insetamos los demas simbolos
       
            for (var j =0; j<lista2.length;j++){
                if(!this.existeSimbolo(retornoSimbolos,lista2[j])){
                    retornoSimbolos.push(lista2[j]);
                }
            }

        
        

		retornoSimbolos.push(returnTemporal);
		ambitos.ambitos.shift();

	}

    return retornoSimbolos;

};

Clase.prototype.existeSimbolo = function(lista, simb){
    var nombre = simb.getNombreCorto().toUpperCase();
    var ambito = simb.getAmbito().toUpperCase();
    var temporal;
    for(var i=0; i<lista.length; i++){
        temporal = lista[i];
        if(temporal.getNombreCorto().toUpperCase() == nombre &&
            temporal.getAmbito().toUpperCase()== ambito ){
                lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un simbolo "+ nombre+", en el ambito "+ambito);
                return true;
            }
    }
    return false;
};


Clase.prototype.obtenerTipoSimbolo = function(tipo) {

    var tipoM = tipo.toUpperCase();

    if (tipoM == "ENTERO" ||
        tipoM == "CARACTER" ||
        tipoM == "DECIMAL" ||
        tipoM == "BOOLEANO") {
        return "VARIABLE";
    } else {
        return "OBJETO";
    }
};


Clase.prototype.obtenerTipoDeclaracion = function(decla) {

    if (decla instanceof AsignaDecla) {
        return 1;
    }

    if (decla instanceof DeclaArreglo) {
        return 2;
    }

    if (decla instanceof DeclaAsignaPuntero) {
        return 3;
    }

    if (decla instanceof DeclaCola) {
        return 4;
    }

    if (decla instanceof DeclaLista) {
        return 5;
    }

    if (decla instanceof DeclaPila) {
        return 6;
    }

    if (decla instanceof DeclaPuntero) {
        return 7;
    }

    if (decla instanceof DeclaVariable) {
        return 8;
    }

};


Clase.prototype.obtenerSimbolosMetodo = function(sents, ambitos){
  
    for(var i = 0; i<sents.length; i++){
       var sentTemporal = sents[i];
       this.simbMet(sentTemporal,ambitos);
    }//fin ciclo de control de sentencias
};



Clase.prototype.simbMet= function(sent, ambitos){

    if(sent instanceof Ciclo_X){
        console.log("entre a un ciclox");
        ambitos.addCicloX();
        var sentencias = sent.getCuerpo();
        for(var j =0; j<sentencias.length;j++){
            console.dir(sentencias[j]);
            this.simbMet(sentencias[j],ambitos);
        }
        ambitos.ambitos.shift();
    }

    if(sent instanceof DeclaVariable){
        var nombreC = sent.getNombre();
        var tipoVar = sent.getTipo();
        var tipoSimb = this.obtenerTipoSimbolo(tipoVar);
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresVariable(nombreC,tipoSimb,tipoVar,ambitos.getAmbitos(),"VAR_LOCAl",apuntador,1);
        lista2.push(nuevoSimbolo);
        apuntador++;
    }



};

module.exports = Clase;