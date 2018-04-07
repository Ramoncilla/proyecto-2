var elementoSentencia = require("./sentenciaNombre");
var elementoCodigo = require("./Codigo");
var nodoCondicion = require("./nodoCondicion");
var Archivo = require("../Arbol/Archivo");
var clase = require("../Arbol/Clase");
var importar = require("../Arbol/Sentencias/Importar");
var tabla_Simbolos= require("../Codigo3D/TablaSimbolos");
var listaErrores = require("../Errores/listaErrores");
var Ambito = require("../Codigo3D/Ambito");
var errores= new listaErrores();
var sentNombre = new elementoSentencia();

/* -------------------------- Constructor ----------------------------------- */
function generacionCodigo(){
	this.sentenciasArchivo=null;
	this.c3d = new elementoCodigo();
	this.listaClase=[];
	this.importaciones=[];
	this.tablaSimbolos = new tabla_Simbolos();

}

generacionCodigo.prototype.setValores = function(sentAr){
	this.sentenciasArchivo = sentAr;

};

/*---------------------------- Generacion del Codigo 3D ---------------------------- */

generacionCodigo.prototype.generar3D= function(){

	// 1. se llena las estructuras de clases y de importaciones
	this.generarClases();

	//2. Generan los elementos que estemos importando
	this.generarImportaciones();

	//3. Se crea la tabla de simbolos
	this.generarSimbolosClase();

	//4. Generar Codigo 3D por cada clase
	var claseTemporal;
	var sentTemporal;
	var nombreClase="";
	var nombreFuncion="";
	var ambitos = new Ambito();
  var funTemporal;
	for(var i=0; i<this.listaClase.length; i++){
		claseTemporal = this.listaClase[i];
		ambitos.addAmbito(claseTemporal.nombre);
    nombreClase = claseTemporal.nombre;
		//1. Traducimos el principal si es que posee
		if(claseTemporal.principal_met!=null){
			nombreFuncion = "PRINCIPAL";
			ambitos.addAmbito(nombreClase+"_PRINCIPAL");
			for(var j = 0; j< claseTemporal.principal_met.sentencias.length; j++){
				sentTemporal = claseTemporal.principal_met.sentencias[j];
				this.escribir3D(sentTemporal, ambitos, nombreClase, nombreFuncion);
			}
			ambitos.ambitos.shift();
		}
		//2. Traducimos funcion por funcion
  
		for(var j = 0; j<claseTemporal.funciones.funciones.length; j++){
			funTemporal = claseTemporal.funciones.funciones[j];
			ambitos.addAmbito(funTemporal.obtenerFirma());
			for(var k =0; k<funTemporal.sentencias.length; k++){
				sentTemporal = funTemporal.sentencias[k];
				this.escribir3D(sentTemporal,ambitos,nombreClase,nombreFuncion);
			}
			ambitos.ambitos.shift();
		}

		ambitos.ambitos.shift();
	}

	return this.tablaSimbolos.obtenerHTMLTabla();

};



/* -------------------------- Generacion de las clases ---------------------- */

generacionCodigo.prototype.generarClases = function() {
	this.listaClase=[];
	this.importaciones=[];
	var sentenciasA = this.sentenciasArchivo.getSentencias();
	var temporal;
      for (var i = 0; i < sentenciasA.length; i++) {
        temporal= sentenciasA[i];
        if(temporal instanceof clase){
          this.listaClase.push(temporal);
		}
		
        if(temporal instanceof importar){
          this.importaciones.push(temporal);
        }

      }	       
};


/* Generando las importaciones  */
generacionCodigo.prototype.generarImportaciones = function (){
    var nombreTemporal;
    var nameImport="";
    for (var i = 0; i < this.importaciones.length; i++) {
      nombreTemporal= this.importaciones[i];
      nameImport+=nombreTemporal+"\n";
      console.log("importando " + nombreTemporal);
    }
  };



/* Generacion de la tabla de simbolos */

 generacionCodigo.prototype.generarSimbolosClase = function(){
    this.agregarHerenciaClases();
    var claseTemporal;
    var simbolosClase = [];
    for (var i = 0; i < this.listaClase.length; i++) {
      claseTemporal = this.listaClase[i];
	  simbolosClase=claseTemporal.generarSimbolosClase();
	  this.tablaSimbolos.insertarSimbolosClase(simbolosClase);
	}
  }; 


/* Agregando la herencia a las clases */
generacionCodigo.prototype.agregarHerenciaClases = function (){
  var claseTemporal;
  var atributosHeredados=[];
  var funcionesHeredadas=[];
  for(var i=0; i<this.listaClase.length;i++){
    claseTemporal= this.listaClase[i];
    if(claseTemporal.herencia !=""){
      var clasePadre = this.obtenerClasePadre(claseTemporal.herencia);
      if(clasePadre!=null){
        console.log("si existe la clase padre");
        atributosHeredados= clasePadre.obtenerAtributosValidosHerencia();
        funcionesHeredadas= clasePadre.obtenerFuncionesValidasHerencia();
        //insertando atributos 
        for(var j =0; j<atributosHeredados.length;j++){
          this.listaClase[i].insertarAtributoHeredado(atributosHeredados[j]);
        }
        //insertando funciones 
        for(var j =0; j<funcionesHeredadas.length;j++){
          this.listaClase[i].insertarFuncionHeredada(funcionesHeredadas[j]);
        }

      }
    }
  }
};


generacionCodigo.prototype.obtenerClasePadre = function(nombre){
  var claseTemporal;
  for(var i=0; i<this.listaClase.length;i++){
    claseTemporal = this.listaClase[i];
    if(claseTemporal.nombre.toUpperCase() == nombre.toUpperCase()){
      return claseTemporal;
    }
  }
  errores.insertarError("Semantico","No existe la clase "+ nombre);
  console.log("no existe la clase "+nombre+" hrencia");
  return null;
};


/* --------------------------- Generacion de codigo */
 

generacionCodigo.prototype.escribir3D= function(nodo,ambitos,clase,metodo){

	
	 var nombreSentecia=sentNombre.obtenerNombreSentencia(nodo);

	//var nombreSentecia = sentNombre.obtenerNombreSentencia(nodo).toUpperCase();
	switch(nombreSentecia.toUpperCase()){

		case "ASIGNACION":{


			var expresionAsig = nodo.getValor();
			var a = this.resolverExpresion (expresionAsig, ambitos, clase, metodo);
			console.log("Resultado   "+ a);
			console.log(this.c3d.getCodigo3D());

			break;
		}
	}
};



generacionCodigo.prototype.resolverExpresion = function(nodo, ambitos, clase, metodo) {

	var nombreSentecia = sentNombre.obtenerNombreExpresion(nodo).toUpperCase();
  console.log("Expresion "+ nombreSentecia);
	switch(nombreSentecia){
		case "ENTERO":{
			 return parseInt(nodo.getNumero());
		}

		case "DECIMAL":{

			return parseFloat(nodo.getNumero());
		}

		case "BOOLEANO":{

			return  nodo.getEnteroBooleano();

		}

		case "CARACTER":{

			return nodo.getEnteroCaracter();

		}

		case "CADENA":{

			break;

		}

		case "ARITMETICA":{
			var val1 = this.resolverExpresion(nodo.getExpresion1(),ambitos,clase,metodo);
			var val2 = this.resolverExpresion(nodo.getExpresion2(),ambitos,clase,metodo);
			var operando = nodo.getOperador();
			switch(operando){

				case "+":{
					var temp1 = this.c3d.getTemporal();
					var cod = "+, "+val1+", "+ val2+", "+temp1;
					this.c3d.addCodigo(cod);
					return temp1;
				}

				case "-":{
					var temp1 = this.c3d.getTemporal();
					var cod = "-, "+val1+", "+ val2+", "+temp1;
					this.c3d.addCodigo(cod);
					return temp1;
				}

				case "*":{
					var temp1 = this.c3d.getTemporal();
					var cod = "*, "+val1+", "+ val2+", "+temp1;
					this.c3d.addCodigo(cod);
					return temp1;
				}

				case "/":{

					var temp1 = this.c3d.getTemporal();
					var cod = "/, "+val1+", "+ val2+", "+temp1;
					this.c3d.addCodigo(cod);
					return temp1;

				}

				break;
			}
		}


		case "RELACIONAL":{

			var val1 = this.resolverExpresion(nodo.getExpresion1(),ambitos,clase,metodo);
			var val2 = this.resolverExpresion(nodo.getExpresion2(),ambitos,clase,metodo);
			var operando = nodo.getOperador();
			switch(operando){

				case "==":{
					var etiqV= this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var cod = "je, "+val1+", "+ val2+", "+etiqV+ "\njmp, , , "+etiqF;
					var res = new nodoCondicion(cod);
					res.addFalsa(etiqF);
					res.addVerdadera(etiqV);
					return res;
				}

				case "!=":{
					var etiqV= this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var cod = "jne, "+val1+", "+ val2+", "+etiqV+ "\njmp, , , "+etiqF;
					var res = new nodoCondicion(cod);
					res.addFalsa(etiqF);
					res.addVerdadera(etiqV);
					return res;
				}


				case ">":{
					var etiqV= this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var cod = "jg, "+val1+", "+ val2+", "+etiqV+ "\njmp, , , "+etiqF;
					var res = new nodoCondicion(cod);
					res.addFalsa(etiqF);
					res.addVerdadera(etiqV);
					return res;
				}


				case ">=":{
					var etiqV= this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var cod = "jge, "+val1+", "+ val2+", "+etiqV+ "\njmp, , , "+etiqF;
					var res = new nodoCondicion(cod);
					res.addFalsa(etiqF);
					res.addVerdadera(etiqV);
					return res;
				}


				case "<":{
					var etiqV= this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var cod = "jl, "+val1+", "+ val2+", "+etiqV+ "\njmp, , , "+etiqF;
					var res = new nodoCondicion(cod);
					res.addFalsa(etiqF);
					res.addVerdadera(etiqV);
					return res;
				}


				case "<=":{
					var etiqV= this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var cod = "jle, "+val1+", "+ val2+", "+etiqV+ "\njmp, , , "+etiqF;
					var res = new nodoCondicion(cod);
					res.addFalsa(etiqF);
					res.addVerdadera(etiqV);
					return res;
				}				
				break;
			}
			break;
		}//fin relacional


    


	}//fin switch
	 
	
};






module.exports = generacionCodigo;




