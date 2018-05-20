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


var terminoID = require("./Expresion/t_id");
var posArreglo = require("./Expresion/PosArreglo");



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
        //console.log("las senticas son nulas");
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
    apuntador=0;
    var temporal, tipoDeclaracion;
    for (var i = 0; i < this.atributos.length; i++) {
        temporal = this.atributos[i];
        var declaracionAtributo = temporal.getDecla();
        var visibilidadAtributo = temporal.getVisibilidad();
        tipoDeclaracion = this.obtenerTipoDeclaracion(declaracionAtributo);
        switch (tipoDeclaracion) {

            case 1: //asignaDecla
                var declaracionElemento = declaracionAtributo.getDecla();
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
                        //console.dir(declaracionAtributo);
                        //console.dir(asignacion);
                        var expresion = asignacion.getValor();
                        nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                       // nuevoSimbolo.setExpresionAtributo(expresion);
                       nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                        listaRetorno.push(nuevoSimbolo);
                        apuntador++;

                    } else {
                        lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreC);
						//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreC);
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
                        
                        var expresion = asignacion.getValor();
                        nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                       // nuevoSimbolo.setExpresionAtributo(expresion);
                       nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                        listaRetorno.push(nuevoSimbolo);
                        apuntador++;

                    } else {
                        lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreArreglo);
						//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreArreglo);
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
                    nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreArreglo);
					//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreArreglo);
                }


                break;

            case 3:
            var puntero = declaracionAtributo.getPuntero();
            var nombrePuntero = puntero.getNombrePuntero();
            if (!(this.existeAtributo(listaRetorno, nombrePuntero))) {
                var tipoPuntero = puntero.getTipoPuntero();
                var nuevoSimbolo = new Simbolo();
                nuevoSimbolo.setValoresPuntero(nombrePuntero, "PUNTERO", tipoPuntero, this.nombre, "ATRIBUTO", apuntador, 1);
                nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                listaRetorno.push(nuevoSimbolo);
                apuntador++;

            } else {
                lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombrePuntero);
                //console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombrePuntero);

            }

            break;



            case 4: //cola
                var nombreCola = declaracionAtributo.getNombre();

                if (!(this.existeAtributo(listaRetorno, nombreCola))) {
                    var tipoCola = declaracionAtributo.getTipo();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresCola(nombreCola, "COLA", tipoCola, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreCola);
					//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreCola);
                }


                break;

            case 5: //lista
                var nombreLista = declaracionAtributo.getNombre();

                if (!(this.existeAtributo(listaRetorno, nombreLista))) {
                    var tipoLista = declaracionAtributo.getTipo();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresLista(nombreLista, "LISTA", tipoLista, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreLista);
					//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreLista);
                }
                break;

            case 6: //pila
                var nombrePila = declaracionAtributo.getNombre();
                if (!(this.existeAtributo(listaRetorno, nombrePila))) {
                    var tipoPila = declaracionAtributo.getTipo();
                    var nuevoSimbolo = new Simbolo();
                    nuevoSimbolo.setValoresPila(nombrePila, "PILA", tipoPila, this.nombre, "ATRIBUTO", apuntador, 1);
                    nuevoSimbolo.setVisibilidad(visibilidadAtributo);
                    nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombrePila);
					//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombrePila);
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
                    nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombrePuntero);
					//console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombrePuntero);

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
                    nuevoSimbolo.setExpresionAtributo(declaracionAtributo);
                    listaRetorno.push(nuevoSimbolo);
                    apuntador++;

                } else {
                    lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un atributo con el nombre de "+ nombreC);
                    //console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombreC);
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
        //console.log(funTemporal.obtenerFirma());
        ambitos.addAmbito(this.nombre);
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
              var tipoSimbolo = this.obtenerTipoSimbolo(parTemp.getTipo());
              if(parTemp.obtenerObjetoParametro() instanceof posArreglo){
                  tipoSimbolo= "ARREGLO";
              }
			 // simbTemporal.setValoresVariable(parTemp.getNombre(),parTemp.getTipo(),this.obtenerTipoSimbolo(parTemp.getTipo()),ambitos.getAmbitos(),"PARAMETRO",apuntador,1);
              simbTemporal.setValoresVariable(parTemp.getNombre(),tipoSimbolo,parTemp.getTipo(),ambitos.getAmbitos(),"PARAMETRO",apuntador,1);
              simbTemporal.setPasoReferencia(parTemp.getPaso());
              simbTemporal.setExpresionAtributo(parTemp.obtenerObjetoParametro());
			  apuntador++;
			  simbParametros.push(simbTemporal);

		  }
          //aqui se genera los simbolos de las sentencias de la funcion
          var sentFuncion = funTemporal.getSentencias();
          lista2=[];
         // //console.log("esta funcion tiene  "+ sentFuncion.length+" SENTENCIAS");
          this.obtenerSimbolosMetodo(sentFuncion,ambitos,simbParametros);
         

		  //creamos simbolo del return
		  returnTemporal= new Simbolo();
		  returnTemporal.setValoresVariable("RETORNO","RETORNO","RETORNO",ambitos.getAmbitos(),"RETORNO",apuntador,1);
		  apuntador++;

		  var sizeFun = 1+simbParametros.length+lista2.length+1;
		 

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
    
    //insertamos los simbolos del principal

    if(this.principal_met!=null){
        ambitos= new Ambito();
        ambitos.addAmbito(this.nombre);
        ambitos.addAmbito(this.nombre+"_PRINCIPAL");
        apuntador=0;
        lista2=[];
        var sentTemporal;
        this.obtenerSimbolosMetodo(this.principal_met.sentencias,ambitos,[]);
        var siz = 0;
        if(lista2!=0){
            siz=lista2.length;
        }
        simbTemporal = new Simbolo();
        simbTemporal.setValoresFuncion(this.nombre+"_PRINCIPAL","PRINCIPAL","PRINCIPAL",this.nombre,"PRINCIPAL",-1,siz,0,"","PRINCIPAL");
        retornoSimbolos.push(simbTemporal);
        for (var j =0; j<lista2.length;j++){
            if(!this.existeSimbolo(retornoSimbolos,lista2[j])){
                retornoSimbolos.push(lista2[j]);
            }
        }
    ambitos.ambitos.shift();
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


Clase.prototype.obtenerSimbolosMetodo = function(sents, ambitos, parametros){
  
    for(var i = 0; i<sents.length; i++){
       var sentTemporal = sents[i];
       this.simbMet(sentTemporal,ambitos,parametros);
    }//fin ciclo de control de sentencias
};



Clase.prototype.simbolosEstructura = function(sent, ambitos, parametros){

};

Clase.prototype.simbMet= function(sent, ambitos, parametros){

    
    if(sent instanceof Estructura){
        var declaraciones = sent.Declas();
        var nombreEd = sent.geNombre();

/////
var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreEd, parametros);
        
        if(cont==0){
            var simboloED = new Simbolo();
            simboloED.setValoresVariable(nombreEd,"ESTRUCTURA", nombreEd,ambitos.getAmbitos(),"ESTRUCTURA", -1, declaraciones.length);
            lista2.push(simboloED);
            apuntador++;
            ambitos.addAmbito(nombreEd);
            for(var i =0; i<declaraciones.length; i++){
                this.simbMet(declaraciones[i],ambitos,parametros);
            }
            ambitos.ambito.shift();
        }else{
            lErrores.insertarError("Semantico","No se ha podido crear la Estructura  "+ nombreEd+", debido a que existe en el ambito actual");
           // //console.log("No se ha podido crear el simbolo "+nombreC+", ya existe en el ambito actual");
        }
         
////

        /*var simboloED = new Simbolo();
        simboloED.setValoresVariable(nombreEd,"ESTRUCTURA", nombreEd,ambitos.getAmbitos(),"ESTRUCTURA", -1, declaraciones.length);
        ambitos.addAmbito(nombreEd);
        for(var i =0; i<declaraciones.length; i++){
            this.simbMet(declaraciones[i],ambitos,parametros);
        }
        ambitos.ambito.shift();*/
    }
    
    if(sent instanceof Si){
        var verdaderas = sent.getVerdaderas();
        var falsas = sent.getFalsas();
        ambitos.addSi();
        for(var i=0; i<verdaderas.length;i++){
            this.simbMet(verdaderas[i],ambitos, parametros);
        }  
       

        if(falsas!=0){
            ambitos.addElse();
        for(var i=0; i<falsas.length;i++){
            this.simbMet(falsas[i],ambitos, parametros);
        }  
        ambitos.ambitos.shift();

        }
        ambitos.ambitos.shift();
        
    }

    if(sent instanceof Repetir_Mientras){
        var cuerpo = sent.getCuerpo();
        ambitos.addRepetirMientras();
        for(var i =0; i< cuerpo.length; i++){
            this.simbMet(cuerpo[i],ambitos,parametros);
        }
        ambitos.ambitos.shift();
    }

    if(sent instanceof Hacer_Mientras){
        var cuerpo = sent.getCuerpo();
        ambitos.addHacerMientras();
        for(var i =0; i< cuerpo.length; i++){
            this.simbMet(cuerpo[i],ambitos,parametros);
        }
        ambitos.ambitos.shift();
    }

    if(sent instanceof Repetir){
        var cuerpo = sent.getCuerpo();
        ambitos.addRepetir();
        for(var i =0; i< cuerpo.length; i++){
            this.simbMet(cuerpo[i],ambitos,parametros);
        }
        ambitos.ambitos.shift();
    }

    if(sent instanceof Repetir_Contando){
        var cuerpo = sent.getCuerpo();
        var variableControl = sent.getDeclaracion();
        ambitos.addRepetirContando();
        this.simbMet(variableControl,ambitos,parametros);
        for(var i =0; i< cuerpo.length; i++){
            this.simbMet(cuerpo[i],ambitos, parametros);
        }
        ambitos.ambitos.shift();
    }


    if(sent instanceof Enciclar){
        var cuerpo = sent.getCuerpo();
        ambitos.addEnciclar();
        for(var i =0; i< cuerpo.length; i++){
            this.simbMet(cuerpo[i],ambitos, parametros);
        }
        ambitos.ambitos.shift();
    }


    if(sent instanceof Contador){
        var cuerpo = sent.getCuerpo();
        ambitos.addContador();
        for(var i =0; i< cuerpo.length; i++){
            this.simbMet(cuerpo[i],ambitos, parametros);
        }
        ambitos.ambitos.shift();
    }


    if(sent instanceof Selecciona){
        var casos = sent.getCasos();
        var defec = sent.getDefecto();
        
        for(var i =0; i<casos.length; i++){
            this.simbMet(casos[i],ambitos, parametros);
        }
     
        ambitos.addDefecto();
        for(var i =0; i<defec.length; i++){
            this.simbMet(defec[i],ambitos, parametros);
        }
        ambitos.ambitos.shift();
    }

    if(sent instanceof Caso){
        var snts = sent.getCuerpo();
        ambitos.addCaso();
        for(var i =0; i<snts.length; i++){
            this.simbMet(snts[i],ambitos, parametros);
        }
        ambitos.ambitos.shift();
    }

    if(sent instanceof Ciclo_X){
        ambitos.addCicloX();
        var sentencias = sent.getCuerpo();
        for(var j =0; j<sentencias.length;j++){
            this.simbMet(sentencias[j],ambitos, parametros);
        }
        ambitos.ambitos.shift();
    }


    if(sent instanceof DeclaVariable){
        var nombreC = sent.getNombre();
        var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreC, parametros);
        
        if(cont==0){
        var tipoVar = sent.getTipo();
        var tipoSimb = this.obtenerTipoSimbolo(tipoVar);
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresVariable(nombreC,tipoSimb,tipoVar,ambitos.getAmbitos(),"VAR_LOCAL",apuntador,1);
        lista2.push(nuevoSimbolo);
        apuntador++;

        }else{
            lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombreC+", debido a que existe en el ambito actual");
           // //console.log("No se ha podido crear el simbolo "+nombreC+", ya existe en el ambito actual");
        }
         
        
    }


    if (sent instanceof DeclaArreglo) {
        var nombreArreglo = sent.getNombre();
        var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreArreglo, parametros);
        
        if(cont==0){
        var tipoArreglo = sent.getTipo();
        var dimensionesArreglo = sent.getDimension();
        var noDim = dimensionesArreglo.length;
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresArreglo(nombreArreglo, "ARREGLO", tipoArreglo, ambitos.getAmbitos(), "ARREGLO_LOCAL", apuntador, 1, noDim, dimensionesArreglo);
        lista2.push(nuevoSimbolo);
        apuntador++;
    }else{
        lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombreArreglo+", debido a que existe en el ambito actual");
       // //console.log("No se ha podido crear el simbolo "+nombreArreglo+", ya existe en el ambito actual");
    }

    }

    if (sent instanceof DeclaAsignaPuntero) {
        var puntero = sent.getPuntero();
        var nombrePuntero = puntero.getNombrePuntero();
        var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombrePuntero,parametros);
        if (cont==0) {
            var tipoPuntero = puntero.getTipoPuntero();
            var nuevoSimbolo = new Simbolo();
            nuevoSimbolo.setValoresPuntero(nombrePuntero, "PUNTERO", tipoPuntero, this.nombre, "PUNTERO_LOCAL", apuntador, 1);
            nuevoSimbolo.setExpresionAtributo(sent.expresion);
            lista2.push(nuevoSimbolo);
            apuntador++;

        } else {
            lErrores.insertarError("Semantico","Ha ocurrido un error, ya existe un simbolo local  con el nombre de "+ nombrePuntero);
            //console.log("Ha ocurrido un error, ya existe un atributo con el nombre de " + nombrePuntero);

        }

        //return 3;
    }

    if (sent instanceof DeclaCola) {
        var nombreCola = sent.getNombre();

        var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreCola,parametros);
        
        if(cont==0){

        var tipoCola = sent.getTipo();
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresCola(nombreCola, "COLA", tipoCola,ambitos.getAmbitos(), "COLA_LOCAL", apuntador, 1);
        lista2.push(nuevoSimbolo);
        apuntador++;
    }else{
        lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombreCola+", debido a que existe en el ambito actual");
////console.log("No se ha podido crear el simbolo "+nombreCola+", ya existe en el ambito actual");
    }
    }

    if (sent instanceof DeclaLista) {
        var nombreLista = sent.getNombre();

        var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreLista,parametros);
        
        if(cont==0){
        var tipoLista = sent.getTipo();
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresLista(nombreLista, "LISTA", tipoLista, ambitos.getAmbitos(), "LISTA_LOCAL", apuntador, 1);
        lista2.push(nuevoSimbolo);
        
        apuntador++;
    }else{
        lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombreLista+", debido a que existe en el ambito actual");
        //   //console.log("No se ha podido crear el simbolo "+nombreLista+", ya existe en el ambito actual");
        }
    }

    if (sent instanceof DeclaPila) {
        var nombrePila = sent.getNombre();

        var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombrePila,parametros);
        
        if(cont==0){
        var tipoPila = sent.getTipo();
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresPila(nombrePila, "PILA", tipoPila, ambitos.getAmbitos(), "PILA_LOCAL", apuntador, 1);
        lista2.push(nuevoSimbolo);
        apuntador++;
    }else{
        lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombrePila+", debido a que existe en el ambito actual");
          //  //console.log("No se ha podido crear el simbolo "+nombrePila+", ya existe en el ambito actual");
        }
    }

    /*
  if(sent instanceof DeclaAsignaPuntero){
    var asignPunt = sent.getPuntero();
    var expPuntero = sent.getExpresion();

    //var puntero = asignPunt.getPuntero();
    var nombrePuntero = asignPunt.getNombrePuntero();

    var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombrePuntero, parametros);
    
    if(cont==0){
    var tipoPuntero = puntero.getTipoPuntero();
    var nuevoSimbolo = new Simbolo();
    nuevoSimbolo.setValoresPuntero(nombrePuntero, "PUNTERO", tipoPuntero, ambitos.getAmbitos(), "PUNTERO_LOCAL", apuntador, 1);
    nuevoSimbolo.setExpresionAtributo(expPuntero);
    lista2.push(nuevoSimbolo);
    apuntador++;
}else{
    lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombrePuntero+", debido a que existe en el ambito actual");
    ////console.log("No se ha podido crear el simbolo "+nombrePuntero+", ya existe en el ambito actual");
}
  }*/


    if (sent instanceof DeclaPuntero) {
        var puntero = sent.getPuntero();
        var nombrePuntero = puntero.getNombrePuntero();
       // //console.log(nombrePuntero);
       // console.dir(sent);
         var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombrePuntero,parametros);
        
        if(cont==0){
        var tipoPuntero = puntero.getTipoPuntero();
        var nuevoSimbolo = new Simbolo();
        nuevoSimbolo.setValoresPuntero(nombrePuntero, "PUNTERO", tipoPuntero, ambitos.getAmbitos(), "PUNTERO_LOCAL", apuntador, 1);
        lista2.push(nuevoSimbolo);
        apuntador++;
    }else{
        lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombrePuntero+", debido a que existe en el ambito actual");
        ////console.log("No se ha podido crear el simbolo "+nombrePuntero+", ya existe en el ambito actual");
    }
    }

    if (sent instanceof AsignaDecla) {
        var declaracionElemento = sent.getDecla();
        var enteroDecla = this.obtenerTipoDeclaracion(declaracionElemento);
        if (enteroDecla == 8) {
            var nombreC = declaracionElemento.getNombre();

            var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreC,parametros);
        
        if(cont==0){
                var tipoElemento = declaracionElemento.getTipo();
                var tipoSimb = this.obtenerTipoSimbolo(tipoElemento);
                var nuevoSimbolo = new Simbolo();
                nuevoSimbolo.setValoresVariable(nombreC, tipoSimb, tipoElemento, ambitos.getAmbitos(), "VARIABLE_LOCAL", apuntador, 1);
                var asignacion = sent.getAsigna();
                var expresion = asignacion.getValor();
                nuevoSimbolo.setExpresionAtributo(expresion);
                lista2.push(nuevoSimbolo);
                apuntador++;
            }else{
                lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombreC+", debido a que existe en el ambito actual");
                //console.log("No se ha podido crear el simbolo "+nombreC+", ya existe en el ambito actual");
            }
        
            
        } else if (enteroDecla == 2) {
            //es un arreglo
            var nombreArreglo = declaracionElemento.getNombre();
            var cont = this.existeEnAmbitoLocal(lista2, ambitos, nombreArreglo, parametros);       
        if(cont==0){
            var tipoArreglo = declaracionElemento.getTipo();
             var dimensionesArreglo = declaracionElemento.getDimension();
             var noDim = dimensionesArreglo.length;
             var nuevoSimbolo = new Simbolo();
             nuevoSimbolo.setValoresArreglo(nombreArreglo, "ARREGLO", tipoArreglo, ambitos.getAmbitos(), "ARREGLO_LOCAL", apuntador, 1, noDim, dimensionesArreglo);
             var asignacion = sent.getAsigna(); 
             var expresion = asignacion.getValor();
            nuevoSimbolo.setExpresionAtributo(expresion);
            lista2.push(nuevoSimbolo);
            apuntador++;
        }else{
            lErrores.insertarError("Semantico","No se ha podido crear el simbolo "+ nombreArreglo+", debido a que existe en el ambito actual");
            //console.log("No se ha podido crear el simbolo "+nombreArreglo+", ya existe en el ambito actual");
        }
        }


    }

};


Clase.prototype.existeEnAmbitoLocal= function(lista, ambitos, nombre, parametros){
    var ambitoTemporal = new Ambito();
    var arr= ambitos.ambitos.slice();
    ambitoTemporal.setAmbitos(arr);


    var ambitoTemporal2 = new Ambito();
    var arr2= ambitos.ambitos.slice();
    ambitoTemporal2.setAmbitos(arr2);

    var cont =0;
    var temporal;
    var cadenaAmbito="";
    if(parametros == 0){
        cont+=0;
    }else{

        for(var i =0; i<ambitos.ambitos.length; i++){
            cadenaAmbito = ambitoTemporal2.getAmbitos();
            //console.log("ambito a analizar de los prametros "+ cadenaAmbito);
            cont=cont + this.existeLista(cadenaAmbito,nombre,parametros);
            ambitoTemporal2.ambitos.shift();
        }


    }
     
    if(lista == 0){
        cont+=0;
    }
 else{
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        //console.log("ambito a analizar "+ cadenaAmbito);

        cont=cont + this.existeLista(cadenaAmbito,nombre,lista);
        ambitoTemporal.ambitos.shift();
    }
    //console.log(cont+"<----- Contador para la vairable " + nombre);
    

 }
 return cont;

};


Clase.prototype.existeLista = function(cadenaAmbito, nombre , lista){
    var simTemporal;
    var cont =0;
    for (var i =0; i<lista.length; i++){
        simTemporal  = lista[i];
        if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
            if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
                //console.log("existe el simbolo "+nombre);
                cont++;
            }
        }
    }
return cont;
};


module.exports = Clase;