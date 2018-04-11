var elementoSentencia = require("./sentenciaNombre");
var elementoCodigo = require("./Codigo");
var nodoCondicion = require("./nodoCondicion");
var Archivo = require("../Arbol/Archivo");
var clase = require("../Arbol/Clase");
var importar = require("../Arbol/Sentencias/Importar");
var tabla_Simbolos= require("../Codigo3D/TablaSimbolos");
var listaErrores = require("../Errores/listaErrores");
var Ambito = require("../Codigo3D/Ambito");
var EleRetorno = require("./retorno");
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
			var nombreAmb= nombreClase+"_PRINCIPAL";
			ambitos.addAmbito(nombreAmb);
			this.c3d.addCodigo("begin, , , "+nombreAmb);
			for(var j = 0; j< claseTemporal.principal_met.sentencias.length; j++){
				sentTemporal = claseTemporal.principal_met.sentencias[j];
				//this.escribir3D(sentTemporal, ambitos, nombreClase, nombreFuncion);
			}
			this.c3d.addCodigo("end, , "+nombreAmb);
			ambitos.ambitos.shift();
		}
		//2. Traducimos funcion por funcion
  
		for(var j = 0; j<claseTemporal.funciones.funciones.length; j++){
			funTemporal = claseTemporal.funciones.funciones[j];
			ambitos.addAmbito(funTemporal.obtenerFirma());
			this.c3d.addCodigo("begin, , , "+funTemporal.obtenerFirma());
			for(var k =0; k<funTemporal.sentencias.length; k++){
				sentTemporal = funTemporal.sentencias[k];
				//this.escribir3D(sentTemporal,ambitos,nombreClase,nombreFuncion);
			}
			this.c3d.addCodigo("end, , "+funTemporal.obtenerFirma());
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

	switch(nombreSentecia.toUpperCase()){

		case "ASIGNACION":{
			var expresionAsig = nodo.getValor();
			var a = this.resolverExpresion (expresionAsig, ambitos, clase, metodo);
			console.log("Resultado   ");
			console.dir(a);
			console.log(this.c3d.getCodigo3D());

			break;
		}

		






	}
};




/*============================================= Validacion de Tipos ============================================ */



/* ================================================ Resolver Expresiones ===================================================== */

generacionCodigo.prototype.resolverExpresion = function(nodo, ambitos, clase, metodo) {

	var nombreSentecia = sentNombre.obtenerNombreExpresion(nodo).toUpperCase();
	console.log("Expresion "+ nombreSentecia);
	
	switch(nombreSentecia){
		case "ENTERO":{
				var ret = new EleRetorno();
				var valEntero = parseInt(nodo.getNumero());
				ret.setValorEntero(valEntero);
				return ret;
		}

		case "DECIMAL":{
				var ret = new EleRetorno();
				var valDecimal = parseFloat(nodo.getNumero());
				ret.setValorDecimal(valDecimal);
				return ret;
		}

		case "BOOLEANO":{
				var ret = new EleRetorno();
				var valBool = nodo.getEnteroBooleano();
				ret.setValorBooleano(valBool);
				return ret;
		}

		case "CARACTER":{
				var ret = new EleRetorno();
				var valCaracter = nodo.getEnteroCaracter();
				ret.setValorChar(valCaracter);
				return ret;
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
					var resoSuma = this.validarSumaOperacion(val1, val2);
					if(resoSuma instanceof EleRetorno){
						if(this.esNulo(resoSuma.tipo)){
							errores.insertarError("Semantico","Tipos no validos para una suma");
						}
					}
					return resoSuma;
				}

				case "-":{
					var resoResta = this.validarRestaOperacion(val1, val2);
					if(resoResta instanceof EleRetorno){
						if(this.esNulo(resoResta.tipo)){
							errores.insertarError("Semantico","Tipos no validos para una resta");
						}
					}
					return resoResta;
				}

				case "*":{
					var resoResta = this.validarMultiplicacionOperacion(val1, val2);
					if(resoResta instanceof EleRetorno){
						if(this.esNulo(resoResta.tipo)){
							errores.insertarError("Semantico","Tipos no validos para una multiplicacion");
						}
					}
					return resoResta;
				}

				case "/":{

					var resoResta = this.validarDivisionOperacion(val1, val2);
					if(resoResta instanceof EleRetorno){
						if(this.esNulo(resoResta.tipo)){
							errores.insertarError("Semantico","Tipos no validos para una division");
						}
					}
					return resoResta;

				}

				case "^":{

					var resoResta = this.validarPotenciaOperacion(val1, val2);
					if(resoResta instanceof EleRetorno){
						if(this.esNulo(resoResta.tipo)){
							errores.insertarError("Semantico","Tipos no validos para una potencia");
						}
					}
					return resoResta;

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
					if(val1 instanceof EleRetorno && val2 instanceof EleRetorno){
						if(!(this.esNulo(val1.tipo)) && !(this.esNulo(val2.tipo))){
							var etiqV= this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();
							var cod = "je, "+val1.valor+", "+ val2.valor+", "+etiqV+ "\njmp, , , "+etiqF;
							var res = new nodoCondicion(cod);
							res.addFalsa(etiqF);
							res.addVerdadera(etiqV);
							return res;
						}else{
							errores.insertarError("Semantico","Tipos no validos para una relacional '==' ");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Tipos no validos para una relacional '==' ");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
					break;
				}

				case "!=":{
					if(val1 instanceof EleRetorno && val2 instanceof EleRetorno){
						if(!(this.esNulo(val1.tipo)) && !(this.esNulo(val2.tipo))){
							var etiqV= this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();
							var cod = "jne, "+val1.valor+", "+ val2.valor+", "+etiqV+ "\njmp, , , "+etiqF;
							var res = new nodoCondicion(cod);
							res.addFalsa(etiqF);
							res.addVerdadera(etiqV);
							return res;
						}else{
							errores.insertarError("Semantico","Tipos no validos para una relacional '!=' ");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Tipos no validos para una relacional '!=' ");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
					break;
				}


				case ">":{
					if(val1 instanceof EleRetorno && val2 instanceof EleRetorno){
						if(!(this.esNulo(val1.tipo)) && !(this.esNulo(val2.tipo))){
							var etiqV= this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();
							var cod = "jg, "+val1.valor+", "+ val2.valor+", "+etiqV+ "\njmp, , , "+etiqF;
							var res = new nodoCondicion(cod);
							res.addFalsa(etiqF);
							res.addVerdadera(etiqV);
							return res;
						}else{
							errores.insertarError("Semantico","Tipos no validos para una relacional '>' ");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Tipos no validos para una relacional '>' ");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
					break;
				}


				case ">=":{
					if(val1 instanceof EleRetorno && val2 instanceof EleRetorno){
						if(!(this.esNulo(val1.tipo)) && !(this.esNulo(val2.tipo))){
							var etiqV= this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();
							var cod = "jge, "+val1.valor+", "+ val2.valor+", "+etiqV+ "\njmp, , , "+etiqF;
							var res = new nodoCondicion(cod);
							res.addFalsa(etiqF);
							res.addVerdadera(etiqV);
							return res;
						}else{
							errores.insertarError("Semantico","Tipos no validos para una relacional '>=' ");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Tipos no validos para una relacional '>=' ");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
					break;

				}


				case "<":{
					if(val1 instanceof EleRetorno && val2 instanceof EleRetorno){
						if(!(this.esNulo(val1.tipo)) && !(this.esNulo(val2.tipo))){
							var etiqV= this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();
							var cod = "jl, "+val1.valor+", "+ val2.valor+", "+etiqV+ "\njmp, , , "+etiqF;
							var res = new nodoCondicion(cod);
							res.addFalsa(etiqF);
							res.addVerdadera(etiqV);
							return res;
						}else{
							errores.insertarError("Semantico","Tipos no validos para una relacional '<' ");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Tipos no validos para una relacional '<' ");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
					break;
				}


				case "<=":{
					if(val1 instanceof EleRetorno && val2 instanceof EleRetorno){
						if(!(this.esNulo(val1.tipo)) && !(this.esNulo(val2.tipo))){
							var etiqV= this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();
							var cod = "jle, "+val1.valor+", "+ val2.valor+", "+etiqV+ "\njmp, , , "+etiqF;
							var res = new nodoCondicion(cod);
							res.addFalsa(etiqF);
							res.addVerdadera(etiqV);
							return res;
						}else{
							errores.insertarError("Semantico","Tipos no validos para una relacional '<=' ");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Tipos no validos para una relacional '<=' ");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
					break;
				}				
				break;
			}
			break;
		}//fin relacional

		case "LOGICA":{

			var val1 = this.resolverExpresion(nodo.getExpresion1(),ambitos,clase,metodo);
			var val2 = this.resolverExpresion(nodo.getExpresion2(),ambitos,clase,metodo);
			var operando = nodo.getOperador();
			switch(operando){

				case "&&":{
					if(val1 instanceof nodoCondicion){
						if(val2 instanceof nodoCondicion){
							var codigoAnd = val1.getCodigo() + "\n" +
									val1.getEtiquetasVerdaderas() + "\n"+
									val2.getCodigo()+"\n";
							var resultadoAnd = new nodoCondicion(codigoAnd);
							resultadoAnd.addEtiquetasVerdaderas(val2.verdaderas);
							resultadoAnd.addEtiquetasFalsas(val1.falsas);
							resultadoAnd.addEtiquetasFalsas(val2.falsas);
							return resultadoAnd;

						}else{
							errores.insertarError("Semantico","Segundo operando de la operacion AND, no es valido");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Primero operando de la operacion AND, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;

					}

					break;
				}


				case "||":{
					if(val1 instanceof nodoCondicion){
						if(val2 instanceof nodoCondicion){

							var codigoOr = val1.getCodigo()+ "\n" +
										   val1.getEtiquetasFalsas()+ "\n" +
										   val2.getCodigo()+ "\n" ;
							var resultadoOr = new nodoCondicion(codigoOr);
							resultadoOr.addEtiquetasVerdaderas(val1.verdaderas);
							resultadoOr.addEtiquetasVerdaderas(val1.verdaderas);
							resultadoOr.addEtiquetasFalsas(val2.falsas);
							return resultadoOr;

						}else{
							errores.insertarError("Semantico","Segundo operando de la operacion AND, no es valido");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Primero operando de la operacion AND, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;

					}

					break;
				}

				case "??":{//xor
					break;
				}

			}




			break;
		}//fin de operaciones logica


    


	}//fin switch
	 
	
};


generacionCodigo.prototype.validarPotenciaOperacion = function(val1, val2){

	var ret; 
	if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
		if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){

			if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
//enteros
			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}else{
				errores.insertarError("Semantico","Tipos no validos para una potencia "+ val1.tipo+", con "+ val2.tipo);
				ret = new EleRetorno();
			ret.setValoresNulos();
			return ret;

			}
			
		}else{
			ret = new EleRetorno();
			ret.setValoresNulos();
			return ret;
		}
	 } else{
		 ret = new EleRetorno();
		 ret.setValoresNulos();
		 return ret;
	 }



};

generacionCodigo.prototype.validarDivisionOperacion = function(val1, val2){
	var ret; 
	if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
		if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){

			if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}else{
				errores.insertarError("Semantico","Tipos no validos para una division "+ val1.tipo+", con "+ val2.tipo);
				ret = new EleRetorno();
			ret.setValoresNulos();
			return ret;

			}
			
		}else{
			ret = new EleRetorno();
			ret.setValoresNulos();
			return ret;
		}
	 } else{
		 ret = new EleRetorno();
		 ret.setValoresNulos();
		 return ret;
	 }


};

generacionCodigo.prototype.validarMultiplicacionOperacion= function(val1, val2){
	var ret; 
	if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
		if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){

			if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			//validacines entero... :D 

			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else{
				errores.insertarError("Semantico","Tipos no validos para una multiplicacion "+ val1.tipo+", con "+ val2.tipo);
				ret = new EleRetorno();
				ret.setValoresNulos();
				return ret;
			}
		}else{
			ret = new EleRetorno();
			ret.setValoresNulos();
			return ret;
		}
	 } else{
		 ret = new EleRetorno();
		 ret.setValoresNulos();
		 return ret;
	 }

};


generacionCodigo.prototype.validarRestaOperacion = function(val1, val2){
	var ret; 
	if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
		if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){

			if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			//enteros

			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp;
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}else{
				errores.insertarError("Semantico","Tipos no validos para una resta "+ val1.tipo+", con "+ val2.tipo);
				ret = new EleRetorno();
				ret.setValoresNulos();
				return ret;

			}
		}else{
			ret = new EleRetorno();
			ret.setValoresNulos();
			return ret;
		}
	 } else{
		 ret = new EleRetorno();
		 ret.setValoresNulos();
		 return ret;
	 }
};

generacionCodigo.prototype.validarSumaOperacion= function(val1, val2){

		var ret; 
		console.dir(val1);
		console.dir(val2);
		if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
			if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){
				
				if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				} 
				else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}

				//retorno tipo entero

				else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esBool(val1.tipo) && this.esBool(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp;
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}else{
                    errores.insertarError("Semantico","Tipos no validos para una suma "+ val1.tipo+", con "+ val2.tipo);
					ret = new EleRetorno();
					ret.setValoresNulos();
					return ret;

				}
			}else{
				ret = new EleRetorno();
				ret.setValoresNulos();
				return ret;

			}
		 } else{
			 ret = new EleRetorno();
			 ret.setValoresNulos();
			 return ret;
		 }

};


generacionCodigo.prototype.esNulo= function(val){
	 return (val.toUpperCase() == "NULO");
};

generacionCodigo.prototype.esInt = function(val){
	return (val.toUpperCase() == "ENTERO");
};

generacionCodigo.prototype.esBool = function(val){
	return (val.toUpperCase() == "BOOLEANO");
};

generacionCodigo.prototype.esDecimal = function(val){
	return (val.toUpperCase() == "DECIMAL");
};

generacionCodigo.prototype.esChar = function(val){
	return (val.toUpperCase() == "CARACTER");
};



generacionCodigo.prototype.validarTipo = function(nodo, ambito, clase, metodo){
	 

};





module.exports = generacionCodigo;




