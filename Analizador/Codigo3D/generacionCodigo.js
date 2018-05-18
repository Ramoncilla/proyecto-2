

var fs = require("fs");
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
var Instancia = require("../Arbol/Expresion/Instancia");
var AsignacionE = require("../Arbol/Sentencias/Asignacion");
var interprete = require("../Interprete/interprete");
var analizInterprete = require("../Interprete/AnalizadorInterprete");
var retornoDireccion = require("../Arbol/retornoDireccion");

var t_id = require("../Arbol/Expresion/t_id");
var objetoEste = require("../Arbol/Expresion/Este");
var term_cadena = require("../Arbol/Expresion/Cadena");
var posicion_arreglo = require("../Arbol/Expresion/PosArreglo");
var llamada_funcion = require("../Arbol/Expresion/Llamada");
var funNativa = require("../Arbol/Expresion/FuncionNativa");

var listaEtiquetas = require("../Codigo3D/Etiquetas");

var elementoAcceso = require("../Arbol/Expresion/Acceso");

var numeroEntero = require("../Arbol/Expresion/Entero");


var errores= new listaErrores();
var sentNombre = new elementoSentencia();
var etiquetasRetorno = new listaEtiquetas();
var etiquetasContinuar = new listaEtiquetas();
var etiquetasBreak = new listaEtiquetas();

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
	errores.reiniciar();

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
		nombreClase = claseTemporal.nombre;
		ambitos.addAmbito(nombreClase);
   
		//1. Traducimos el principal si es que posee
		if(claseTemporal.principal_met!=null){
			nombreFuncion = nombreClase+"_PRINCIPAL";
			var nombreAmb= nombreClase+"_PRINCIPAL";
			ambitos.addAmbito(nombreAmb);
			this.c3d.addCodigo("");
			this.c3d.addCodigo("");
			this.c3d.addCodigo("begin, , , "+nombreAmb);
			this.c3d.addCodigo("");
			var etiquetaReturn = this.c3d.getEtiqueta();
			etiquetasRetorno.insertarEtiqueta(etiquetaReturn);
			for(var j = 0; j< claseTemporal.principal_met.sentencias.length; j++){
				sentTemporal = claseTemporal.principal_met.sentencias[j];
				this.escribir3D(sentTemporal, ambitos, nombreClase, nombreAmb);
			}
			this.c3d.addCodigo("");
			this.c3d.addCodigo(etiquetaReturn+":");
			etiquetasRetorno.eliminarActual();
			this.c3d.addCodigo("end, , "+nombreAmb);
			this.c3d.addCodigo("");
			this.c3d.addCodigo("");
			ambitos.ambitos.shift();
			
		}
		//2. Traducimos funcion por funcion
  
		for(var j = 0; j<claseTemporal.funciones.funciones.length; j++){
			funTemporal = claseTemporal.funciones.funciones[j];
			ambitos.addAmbito(funTemporal.obtenerFirma());
			nombreFuncion = funTemporal.obtenerFirma();
			this.c3d.addCodigo("");
			this.c3d.addCodigo("");
			this.c3d.addCodigo("begin, , , "+funTemporal.obtenerFirma());
			this.c3d.addCodigo("");
			var etiquetaRetorno = this.c3d.getEtiqueta();
		    etiquetasRetorno.insertarEtiqueta(etiquetaRetorno);
			//hacemos la diferencia entre constructores y funciones normales 
			if(funTemporal.esConstructor){
				//buscamos los atributos que poseen asignacion
				var atributosAsignar = this.tablaSimbolos.obteberAtributosClase(nombreClase);
				if(atributosAsignar!=0){
					// el arreglo trae mas de algun atributo para asignar
					var atriTemporal;
					for(var h =0; h< atributosAsignar.length; h++){
						atriTemporal = atributosAsignar[h];
						this.escribir3D(atriTemporal.expresionAtributo, ambitos,nombreClase,funTemporal.obtenerFirma());
					}
				}
			}
			for(var k =0; k<funTemporal.sentencias.length; k++){
				sentTemporal = funTemporal.sentencias[k];
				this.escribir3D(sentTemporal,ambitos,nombreClase,funTemporal.obtenerFirma());
			}
			this.c3d.addCodigo("");
			this.c3d.addCodigo(etiquetaRetorno+":");
			etiquetasRetorno.eliminarActual();
			this.c3d.addCodigo("end, , "+funTemporal.obtenerFirma());
			this.c3d.addCodigo("");
			this.c3d.addCodigo("");
			ambitos.ambitos.shift();
		}

		ambitos.ambitos.shift();
	}

	fs.writeFileSync('./codigo3DGenerado.txt',this.c3d.codigo3D);
	fs.writeFileSync('./TablaSimbolos.html',this.tablaSimbolos.obtenerHTMLTabla());
	fs.writeFileSync('./Errores.html', errores.obtenerErroresHTML());

	var a = new analizInterprete();
	a.Ejecutar3D(this.c3d.codigo3D,this.buscarPrincipal());
	console.log("Impresion");
	console.log(a.cadenaImpresion);
	fs.writeFileSync('./Heap.html', a.imprimirHeap());
	fs.writeFileSync('./Stack.html', a.imprimirStack());
	fs.writeFileSync('./temporales.html',a.temporales.imprimirHTML());
	return this.tablaSimbolos.obtenerHTMLTabla();

};

generacionCodigo.prototype.buscarPrincipal = function(){
	var claseTemporal;
	for(var i = (this.listaClase.length-1); i>=0; i++){
		claseTemporal = this.listaClase[i];
		if(claseTemporal.principal_met!=null){
			return claseTemporal.nombre+"_PRINCIPAL";
		}
	}

	return "";
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


/* --------------------------- Generacion de codigo -------------------------- */

generacionCodigo.prototype.calculoArregloNs = function(posiciones, ambitos, clase, metodo){
	var posTemporal;
	var retornoTamanio =[];
	var elemento;
	for(var i =0; i<posiciones.length; i++){
		posTemporal= posiciones[i];
		elemento = this.resolverExpresion(posTemporal,ambitos,clase,metodo);
		if(elemento instanceof EleRetorno){
			if(elemento.tipo.toUpperCase() == "ENTERO"){
				retornoTamanio.push(elemento.valor);
			}else{
				errores.insertarError("Semantico", "Tipo no valido para el tamanio de un arreglo, "+ elemento.tipo);
			}

		}else{
			errores.insertarError("SEmantico", "Hubo un error al reconcer el tamanio del arreglo");
		}

	}

	return retornoTamanio;

};



generacionCodigo.prototype.escribir3D= function(nodo,ambitos,clase,metodo){

	var nombreSentecia=sentNombre.obtenerNombreSentencia(nodo);
	 
	switch(nombreSentecia.toUpperCase()){

	
		case "DECLA_PUNTERO":{
			/*var a = this.crearPunteroNulo(nodo, ambitos,clase, metodo);
			if(a.tipo.toUpperCase() == "NULO"){
				errores.insertarError("SEmantico", "Ha ocurrido un error al crear el puntero");
			}else{
				var tipoPuntero = a.tipo;
				var valorPuntero = a.valor;
				var estructuraPuntero = a.estructura;
				var referenciaPuntero = a.referencia;
			}*/
			break;
		}// fin decla_puntero
		
		case "DECLA_ASIGNA_PUNTERO":{

			var punteroDecla = nodo.puntero;
			var expresionDecla = nodo.expresion;
			var nombrePuntero = punteroDecla.nombrePuntero;
			var valorPuntero = punteroDecla.valorPuntero;
			var tipoPuntero = punteroDecla.tipoPuntero;
			var esAtributo = this.tablaSimbolos.esAtributo(nombrePuntero,ambitos);
			if(esAtributo!=null){
				var tempPosFinal="";
				var estructura="";
				if(esAtributo){
					var posVar = this.tablaSimbolos.obtenerPosAtributo(nombrePuntero, ambitos);
					if(posVar!=-1){
						estructura="heap";
						var temp1 = this.c3d.getTemporal();
						var temp2= this.c3d.getTemporal();
						var temp3 = this.c3d.getTemporal();
						tempPosFinal= this.c3d.getTemporal();
						this.c3d.addCodigo("+, P, 0, "+temp1+";");
						this.c3d.addCodigo("=>, "+temp1+", "+temp2+", stack; ");
						this.c3d.addCodigo("=>, "+temp2+", "+temp3+", heap; ");
						this.c3d.addCodigo("+, "+temp3+", "+posVar+", "+tempPosFinal+"; // pos final donde se encuentra el puntero "+ nombrePuntero);
					}else{
						errores.insertarError("Semantico", "El puntero global"+ nombrePuntero+", no existe");
					}
				}else{

					var posVar = this.tablaSimbolos.obtenerPosLocal(nombrePuntero,ambitos);
					if(posVar!=-1){
						estructura="stack";
						tempPosFinal = this.c3d.getTemporal();
						this.c3d.addCodigo("+, P, "+posVar+", "+tempPosFinal+"; // pos donde se encuenta el punero "+ nombrePuntero);
					}else{
						errores.insertarError("Semantico", "El puntero local"+ nombrePuntero+", no existe");

					}
				}
				if(tempPosFinal!=""){
					 var retExpresion = this.resolverExpresion(expresionDecla, ambitos, clase, metodo);
					 if(retExpresion instanceof EleRetorno){
						 if(retExpresion.tipo.toUpperCase() != "NULO"){
							 if(retExpresion.tipo.toUpperCase() == tipoPuntero.toUpperCase()){
								 this.c3d.addCodigo("<=, "+tempPosFinal+", "+ retExpresion.valor+", "+estructura+"; // asignando al puntero "+ nombrePuntero);
							 }else{
								 errores.insertarError("Semantico", "Incompatibilidad de tipos, puntero de tipo, "+tipoPuntero+", con "+ retExpresion.tipo);
							 }
						 }else{
							errores.insertarError("Semantico", "Resuptado de tipo nulo, ha ocurrido un error en resolver para puntero "+ nombrePuntero);
						 }
					 }else{
						 errores.insertarError("Semantco", "Ha ocurrido un error para resolver operacion de puntero "+ nombrePuntero);
					 }
					
				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver para puntero "+nombrePuntero);
				}
			}else{
				errores.insertarError("Semantico", "No existe el elemento "+ nombrePuntero+", de tipo puntero ");
			}
			break;
		}// fin decla asigna putnero
		

		case "ASIGNACION_UNARIO":{
			var elementoUnario = nodo.elementoAsignacionUnario;
			var simbOperacion = nodo.simboloUnario;
			var tipoAsigUnario = nodo.tipoAsignacionArreglo;
			var resElmentoUnario = new EleRetorno();
			resElmentoUnario.setValoresNulos();

			if(elementoUnario instanceof t_id){
				resElmentoUnario = this.resolverExpresion(elementoUnario,ambitos,clase,metodo);
			}
			if(elementoUnario instanceof objetoEste){
				resElmentoUnario = this.resolverEste(elementoUnario,ambitos,clase,metodo);
			}
			if(elementoUnario instanceof elementoAcceso){
				resElmentoUnario = this.resolverAcceso(elementoUnario,ambitos,clase,metodo);
			}

			if(resElmentoUnario.tipo.toUpperCase() != "NULO"){
				var numeroUno = new numeroEntero();
				numeroUno.setNumero(1);
				var expUno = this.resolverExpresion(numeroUno, ambitos, clase,metodo);
				var resOperacion = new EleRetorno();
				resOperacion.setValoresNulos();

				if(simbOperacion == "++"){
					resOperacion = this.validarSumaOperacion(resElmentoUnario, expUno);
				}else{
					resOperacion = this.validarRestaOperacion(resElmentoUnario,expUno);
				}

				if(resOperacion.tipo.toUpperCase() !=  "NULO"){
					if(resOperacion.tipo.toUpperCase() == resElmentoUnario.tipo.toUpperCase()){
						this.c3d.addCodigo("<=, "+ resElmentoUnario.referencia+", "+resOperacion.valor+", "+ resElmentoUnario.estructura+"; // asignando operaicon con unario");
					}else{
						errores.insertarError("Semantico", "Incompatibilidad de tipos entre "+ resElmentoUnario.tipo+", con "+ resOperacion.tipo);
					}

				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver la operacion con el unario");
				}
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un erro al resolver la asignacion de un unario");
			}
			break;
		}

		case "DECLA_PILA":{
			this.instanciarEstructura(nodo,ambitos,clase, metodo);
			break;
		}

		case "DECLA_COLA":{
			this.instanciarEstructura(nodo,ambitos,clase, metodo);
			break;
		}

		case "ACCESO":{
			var t = this.resolverAcceso(nodo,ambitos,clase,metodo);
			break;
		}

		case "DECLA_LISTA":{
			this.instanciarEstructura(nodo,ambitos,clase, metodo);
			break;
		}
	   
		case "ASIGNA_DECLA":{
			console.log("----------------- Entre a un asigna Decla  ---------------------------");
			var decla = nodo.declaracionE;
			this.escribir3D(decla, ambitos, clase,metodo);
			var asigna = nodo.asignacionE;
			this.escribir3D(asigna, ambitos,clase,metodo);
			break;
		}

		case "ASIGNACION_ARREGLO":{
			console.log("------------------ Entre a una asignacion Arreglo  --------------------");
			var nombreArreglo = nodo.elementoAsignacionArreglo;
			var posicionesArreglo = nodo.dimensiones;
			var simboloIgual = nodo.simboloIgual;
			var expresionArreglo = nodo.valorAsignacionArreglo;
			var tipoArreglo = this.tablaSimbolos.obtenerTipo(nombreArreglo, ambitos);
			var tiAsig = nodo.tipoAsignacionArreglo;
			if(tiAsig!=17){
				this.c3d.addCodigo("// Asignar un posicion del arreglo ");
				var apuntadorArreglo = this.obtenerApuntadorPosArreglo(nombreArreglo,posicionesArreglo,ambitos,clase,metodo,0,false);
				if(apuntadorArreglo.tipo.toUpperCase() != "NULO"){
					var ret = this.resolverExpresion(expresionArreglo,ambitos,clase,metodo);
					if(ret.tipo.toUpperCase()== tipoArreglo.toUpperCase() || ret.tipo.toUpperCase() == "NULO2"){
						var l1_1= "<=, "+apuntadorArreglo.valor+", "+ ret.valor+", heap; // asignando al heap en la nueva posicion de arreglo "+nombreArreglo;
						this.c3d.addCodigo(l1_1);	
					}else{ 
						errores.insertarError("Semantico", "Imposible asignar posicion de "+ nombreArreglo+" de tipo "+ tipoArreglo+", con "+ ret.tipo);
					}
				}else{
					errores.insertarError("Semantico","No se ha podido insertar al arreglo "+nombreArreglo);
				}
			}else{
				//quiero asignar a una arreglo una cadena o un {{1,2,3,4},{1,2,3,4}}
				var esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo,ambitos);
				if(esAtributo!=null){
					var tempSize=this.c3d.getTemporal();
					var tempPos0 = this.c3d.getTemporal();
					if(esAtributo){
						var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreArreglo,ambitos);
						if(posArreglo!=1){
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var temp3= this.c3d.getTemporal();
							var temp4= this.c3d.getTemporal();
							var temp5= this.c3d.getTemporal();
							var l1= "+, P, 0, "+temp1+"; // pos this del objeto ";
							var l2= "=>, "+temp1+", "+temp2+", stack; // apuntador al heap del objeto ";
							var l3= "=>, "+temp2+", "+temp3+", heap; // apunt al heap donde inica el objeto";
							var l4 = "+, "+temp3+", "+posArreglo+", "+temp4+"; //apuntador a posicion donde incia el arreglo";
							var l5 = "=>, "+temp4+", "+temp5+", heap; // inicia el arreglo";
							var l6 = "=>, "+temp5+", "+tempSize+", heap; // size del arreglo "+ nombreArreglo;
							var l7 = "+, "+temp5+", 1, "+tempPos0+"; //Pos 0 del arreglo";
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							this.c3d.addCodigo(l6);
							this.c3d.addCodigo(l7);	
						}
					}else{
						//es un arreglo local
						var posArreglo = this.tablaSimbolos.obtenerPosLocal(nombreArreglo,ambitos);
						if(posArreglo!=-1){
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var temp3= this.c3d.getTemporal();

							var l1 = "+, P, "+posArreglo+", "+temp1+"; // pos del arreglo ";
							var l2 = "=>, "+temp1+", "+temp2+", stack; //apuntador al heap del arreglo";
							var l3 = "=>, "+temp2+", "+temp3+", heap; // apuntador del heap al heap donde inicia la cadena";
							var l4 = "=>, "+temp3+", "+tempSize+", heap; // size del arreglo "+ nombreArreglo;
							var l5 = "+, "+temp3+", 1, "+tempPos0+"; // pos 0 donde inicia el arreglo "+nombreArreglo;
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							
						}
					}

					var retExp = this.resolverExpresion(expresionArreglo,ambitos,clase,metodo);
					if(retExp.tipo.toUpperCase()== "CADENA"){
						var tempApuntCadena= retExp.valor;
						var temp1= this.c3d.getTemporal();
						var tempSizeCadena = this.c3d.getTemporal();
						var tempPos0Cadena= this.c3d.getTemporal();
						var tempoCaracterCadena = this.c3d.getTemporal();
						var l1_1= "=>, "+tempApuntCadena+", "+temp1+", heap; // pos que apunta al size de la cadena";
						var l1_2= "=>, "+temp1+", "+tempSizeCadena+", heap; // size de la cadena";
						var l1_3= "+, "+temp1+", 1, "+tempPos0Cadena+"; // Pos 0 de la cadena";
						var l1_4= "=>, "+tempPos0Cadena+", "+tempoCaracterCadena+", heap; // sacandor el caracter del heap cadena";
						this.c3d.addCodigo(l1_1);
						this.c3d.addCodigo(l1_2);
						this.c3d.addCodigo(l1_3);
						this.c3d.addCodigo(l1_4);

						var etiq1V= this.c3d.getEtiqueta();
						var etiq1F= this.c3d.getEtiqueta();
						var etiq2V= this.c3d.getEtiqueta();
						var etiq2F = this.c3d.getEtiqueta();
						
						var l1_5="jle, "+tempSizeCadena+", "+tempSize+", "+etiq1V+";";
						var l1_6= "jmp, , , "+ etiq1F+";";
						var l1_18= "jmp, , , "+ etiq1V+";";
						var l1_7= etiq1V+":";
						var l1_8="jne, "+tempoCaracterCadena+", 34, "+etiq2V+";";
						var l1_9="jmp, , , "+etiq2F+";";
						var l1_19= "jmp, , , "+ etiq2V+";";
						var l1_10=etiq2V+":";
						var l1_11="<=, "+tempPos0+", "+tempoCaracterCadena+", heap; // guardando el caracter ";
						var l1_12="+, "+tempPos0+", 1, "+tempPos0+"; // incremnetnado la pos del arreglo";
						var l1_13="+, "+tempPos0Cadena+", 1, "+tempPos0Cadena+"; // incrementando la pos de la cadena";
						var l1_14= "=>, "+tempPos0Cadena+", "+tempoCaracterCadena+", heap; // sacandor el caracter del heap cadena";
						var l1_15= "jmp, , , "+ etiq1V+";";
						var l1_20= "jmp, , , "+ etiq2F+";";
						var l1_16=etiq2F+":";
						var l1_21= "jmp, , , "+ etiq1F+";";
						var l1_17 = etiq1F+":";
						this.c3d.addCodigo(l1_5);
						this.c3d.addCodigo(l1_6);
						this.c3d.addCodigo(l1_18);
						this.c3d.addCodigo(l1_7);
						this.c3d.addCodigo(l1_8);
						this.c3d.addCodigo(l1_9);
						this.c3d.addCodigo(l1_19);
						this.c3d.addCodigo(l1_10);
						this.c3d.addCodigo(l1_11);
						this.c3d.addCodigo(l1_12);
						this.c3d.addCodigo(l1_13);
						this.c3d.addCodigo(l1_14);
						this.c3d.addCodigo(l1_15);
						this.c3d.addCodigo(l1_20);
						this.c3d.addCodigo(l1_16);
						this.c3d.addCodigo(l1_21);
						this.c3d.addCodigo(l1_17);
						
					
					}	
				}
	
			}
			
			break;
		}

		case "DECLA_ARREGLO":{
			var tipoArreglo = nodo.tipoArreglo;
			var nombreArreglo = nodo.nombreArreglo;
			var dimensionesArreglo = nodo.dimensionesArreglo;
			this.declararArreglo(tipoArreglo,nombreArreglo,dimensionesArreglo,ambitos,clase,metodo);
			break;
		}
		
		case "ASIGNACION":{

			var tipoAsignacion = nodo.getTipo();
			switch (tipoAsignacion){

				case 1:{
					//id SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($1,$2,$3,1); $$=a;} //1
					var nombreVar = nodo.getElemento();
					var tipoVar= this.tablaSimbolos.obtenerTipo(nombreVar, ambitos);
					var expresionVar = nodo.getValor();
					var simboloIgual = nodo.getSimbolo();
					var esAtributo = this.tablaSimbolos.esAtributo(nombreVar,ambitos);
					var retExpresion
					if(esAtributo!= null){
						var simboloElemento = this.tablaSimbolos.obtenerSimbolo(nombreVar,ambitos,esAtributo);
						if(simboloElemento.tipoSimbolo.toUpperCase()=="ARREGLO"){
							 retExpresion = this.resolverExpresion(expresionVar,ambitos,clase,metodo);
									if(retExpresion instanceof EleRetorno){
										if(retExpresion.tipo.toUpperCase() == "CADENA"){
											this.asignarCadenaArreglo(nombreVar,retExpresion,ambitos,clase, metodo);
										}else{
											errores.insertarError("Semantico", "Tipo no valido para asingar a una arreglo "+ retExpresion.tipo);
										}
									}else{
										errores.insertarError("Semantico", "Hubo un error al resolver expresion para asignar arreglo");
									}
						return;
						}
						if(esAtributo){
							// es un atributo
                            

							var posVar = this.tablaSimbolos.obtenerPosAtributo(nombreVar, ambitos);
							if(posVar!= -1){
								var temp1 = this.c3d.getTemporal();
								var l1 = "+, p, 0, "+temp1+"; //pos this ";
								var temp2 = this.c3d.getTemporal();
								var l2 = "=>, "+temp1+", "+temp2+", stack; // apuntador al heap";
								var temp3 = this.c3d.getTemporal();
								var l3 = "=>, "+temp2+", "+temp3+", heap; // apuntador donde inicia el objeto";
								var temp4 = this.c3d.getTemporal();
								var l4 = "+, "+temp3+", "+posVar+", "+temp4+"; // pos real  de "+nombreVar;
								this.c3d.addCodigo("// Asignando atributo "+ nombreVar);
								this.c3d.addCodigo(l1);
								this.c3d.addCodigo(l2);
								this.c3d.addCodigo(l3);
								this.c3d.addCodigo(l4);

								if(simboloIgual == "="){
									retExpresion = this.resolverExpresion(expresionVar,ambitos,clase,metodo);
									if(retExpresion instanceof EleRetorno){
										if(retExpresion.tipo.toUpperCase() != "NULO"){
											if(retExpresion.tipo.toUpperCase() == "NULO2" || retExpresion.tipo.toUpperCase() == tipoVar.toUpperCase()){
												var l5 = "<=, "+temp4+", "+retExpresion.valor+", heap; //guardando en el heap el valor del atributo";
												this.c3d.addCodigo(l5);
											}
										}else{
											errores.insertarError("Semantico", "Hubo un error al realizar la operacion para "+ nombreVar);
										}
									}else{
										errores.insertarError("Semantico", "Hubo un error al realizar la operacion");
									}

								}else{ // es *=, +=, -=,/=
									
									var temp1_3 = this.c3d.getTemporal();
									var l1_3= "=>, "+temp4+", "+temp1_3+", heap; //obtenidoe el valor de "+nombreVar;
									this.c3d.addCodigo(l1_3);
									var retExpresion = this.resolverExpresion(expresionVar,ambitos,clase,metodo);
									if(retExpresion instanceof EleRetorno){
										if(retExpresion.tipo.toUpperCase()!="NULO"){
											var val1_1 = new EleRetorno();
											val1_1.valor = temp1_3;
											val1_1.tipo = tipoVar.toUpperCase();
											var ret;
											if(simboloIgual=="+="){
												ret = this.validarSumaOperacion(val1_1, retExpresion);

												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l5 = "<=, "+temp4+", "+ret.valor+", heap; //guardando en el heap el valor del atributo "+nombreVar;
													this.c3d.addCodigo(l5);
												}else{
													errores.insertarError("Semantico", "Tipo "+ ret.tipo+", no valido para asignar a "+ nombreVar);
												}

											}
											
											if(simboloIgual=="-="){
												ret = this.validarRestaOperacion(val1_1, retExpresion);
												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l5 = "<=, "+temp4+", "+ret.valor+", heap; //guardando en el heap el valor del atributo "+nombreVar;
													this.c3d.addCodigo(l5);
												}else{
													errores.insertarError("Semantico", "Tipo "+ ret.tipo+", no valido para asignar a "+ nombreVar);
												}
											}

											if(simboloIgual=="*="){
												ret = this.validarMultiplicacionOperacion(val1_1, retExpresion);
												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l5 = "<=, "+temp4+", "+ret.valor+", heap; //guardando en el heap el valor del atributo "+nombreVar;
													this.c3d.addCodigo(l5);
												}else{
													errores.insertarError("Semantico", "Tipo "+ ret.tipo+", no valido para asignar a "+ nombreVar);
												}
											}

											if(simboloIgual=="/="){
												ret = this.validarDivisionOperacion(val1_1, retExpresion);
												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l5 = "<=, "+temp4+", "+ret.valor+", heap; //guardando en el heap el valor del atributo "+nombreVar;
													this.c3d.addCodigo(l5);
												}else{
													errores.insertarError("Semantico", "Tipo "+ ret.tipo+", no valido para asignar a "+ nombreVar);
												}
											}

											
										}

									}else{
										errores.insertarError("Semantico", "Hubo un error al realizar la operacion para "+ nombreVar);
									}

								}
								

							}else{
								errores.insertarError("Semantico", "La variable "+nombreVar+", no existe");
							}

						}else{
							// es una vairable local
							var pos = this.tablaSimbolos.obtenerPosLocal(nombreVar,ambitos);
							var tipoV = this.tablaSimbolos.obtenerTipo(nombreVar,ambitos);
							if(pos!=-1){
								var temp1 = this.c3d.getTemporal();
								var l1 = "+, p, "+pos+", "+temp1+"; // pos de "+nombreVar;
								//var temp2 = this.c3d.getTemporal();
								this.c3d.addCodigo("// -------------- Resolviendo para un ID (var local) Asignacion ------------");
								this.c3d.addCodigo(l1);

								if(simboloIgual == "="){
									var retExpresion = this.resolverExpresion(expresionVar,ambitos,clase, metodo);
								if(retExpresion instanceof EleRetorno){
									if(retExpresion.tipo.toUpperCase() != "NULO"){
										if(retExpresion.tipo.toUpperCase() == tipoVar.toUpperCase() || retExpresion.tipo.toUpperCase()== "NULO2"){
											var l2 = "<=, "+temp1+", "+ retExpresion.valor+", stack; // asignando a "+ nombreVar;
											this.c3d.addCodigo(l2);
										
										}else{
											errores.insertarError("Semantico", "Tipo "+ retExpresion.tipo+", no valido para asignar a "+ nombreVar);
										}
										
									}else{

										errores.insertarError("Semantico", "Hubo un error al reslver para "+ nombreVar);
									}


								}else{
									errores.insertarError("Semantico", "Ocurrio un error al resolver para "+ nombreVar);
								}
								}else{
									//+=,*=,/=,-=
									console.log("es una variable local");
									console.dir(expresionVar);
									var temp1_3 = this.c3d.getTemporal();
									var l1_3= "=>, "+temp1+", "+temp1_3+", stack; //obtenidoe el valor de "+nombreVar;
									this.c3d.addCodigo(l1_3);
									var retExpresion = this.resolverExpresion(expresionVar,ambitos,clase,metodo);
									if(retExpresion instanceof EleRetorno){
										if(retExpresion.tipo.toUpperCase()!="NULO"){
											var val1_1 = new EleRetorno();
											val1_1.valor = temp1_3;
											val1_1.tipo = tipoVar.toUpperCase();
											var ret;
											if(simboloIgual=="+="){
												ret = this.validarSumaOperacion(val1_1, retExpresion);

												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l2 = "<=, "+temp1+", "+ ret.valor+", stack; // asignando a "+ nombreVar;
													this.c3d.addCodigo(l2);
												
												}else{
													errores.insertarError("Semantico", "Tipo "+ retExpresion.tipo+", no valido para asignar a "+ nombreVar);
												}

											}
											
											if(simboloIgual=="-="){
												ret = this.validarRestaOperacion(val1_1, retExpresion);

												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l2 = "<=, "+temp1+", "+ ret.valor+", stack; // asignando a "+ nombreVar;
													this.c3d.addCodigo(l2);
												
												}else{
													errores.insertarError("Semantico", "Tipo "+ retExpresion.tipo+", no valido para asignar a "+ nombreVar);
												}

											}
											

											if(simboloIgual=="*="){
												ret = this.validarMultiplicacionOperacion(val1_1, retExpresion);

												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l2 = "<=, "+temp1+", "+ ret.valor+", stack; // asignando a "+ nombreVar;
													this.c3d.addCodigo(l2);
												
												}else{
													errores.insertarError("Semantico", "Tipo "+ retExpresion.tipo+", no valido para asignar a "+ nombreVar);
												}

											}
											

											if(simboloIgual=="/="){
												ret = this.validarDivisionOperacion(val1_1, retExpresion);
												

												if(ret.tipo.toUpperCase() == tipoVar.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
													var l2 = "<=, "+temp1+", "+ ret.valor+", stack; // asignando a "+ nombreVar;
													this.c3d.addCodigo(l2);
												
												}else{
													errores.insertarError("Semantico", "Tipo "+ retExpresion.tipo+", no valido para asignar a "+ nombreVar);
												}
											}	
										}
									}else{
										errores.insertarError("Semantico", "Hubo un error al realizar la operacion para "+ nombreVar);
									}
								}	
							}else{
								errores.insertarError("Semantico", "La variable "+ nombreId +", no existe");
								var ret = new EleRetorno();
								ret.setValoresNulos();
								return ret;

							}
						}

					}else{
						errores.insertarError("Semantico", "No existe la vairable "+ nombreVar);
					}
					break;
				}

				case 2:{
					//|id igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,2); $$=a;}//2
					var nombreVar = nodo.getElemento();
					var tipoVar = this.tablaSimbolos.obtenerTipo(nombreVar,ambitos); 
					var nodoInstancia = nodo.getValor();
					var nombreClaseInstanciar = nodoInstancia.getTipo();
					var parametrosInstancia = nodoInstancia.getParametros();
					var noParametros =0;
					if(parametrosInstancia==0){
						noParametros=0;
					}else{
						noParametros= parametrosInstancia.length;
					}

					var firmMetodo = this.tablaSimbolos.obtenerFirmaMetodo(nombreClaseInstanciar,noParametros,nombreClaseInstanciar);
					var sizeFuncActual = this.tablaSimbolos.sizeFuncion(clase,metodo);

					//console.log("CLASE "+ nombreClaseInstanciar + "  No Parametros  "+ noParametros +"  Nombre Clase a  Instancia  "+ nombreClaseInstanciar);
					//console.log("Nombre del metodo "+ firmMetodo);
					if(tipoVar.toUpperCase() == nombreClaseInstanciar.toUpperCase() && firmMetodo!=""){
						var sizeClase = this.tablaSimbolos.SizeClase(nombreClaseInstanciar);
						var esAtributo = this.tablaSimbolos.esAtributo(nombreVar,ambitos);
						
						if(esAtributo!=null){
							if(esAtributo){
								// se realizara una instancia de un atributo
								console.log("INSTANCIA DE ATRIBUTO");
								var posVar = this.tablaSimbolos.obtenerPosAtributo(nombreVar,ambitos);
								if(posVar!= -1){
									var temp = this.c3d.getTemporal();
									var l1 = "+, p, 0, "+temp+";// pos this de "+nombreVar;
									var temp2 = this.c3d.getTemporal();
									var l2= "=>, "+temp+", "+temp2+", stack; //apuntador del heap de "+ nombreVar;
									var temp3 = this.c3d.getTemporal();
									var l3 = "=>, "+temp2+", "+temp3+", heap; //posicion real del heap donde inicia "+nombreVar;
									var temp4= this.c3d.getTemporal();
									var l4 ="+, "+temp3+", "+posVar+", "+temp4+"; //pos real del atributo "+nombreVar;
									var l5 ="<=, "+temp4+", h, heap; //guardando la pos real donde inicia el objeto "+nombreVar;
									var l6 ="+, h, "+sizeClase+", h; // reservando el espacio de memoria para el nuevo objeto "+ nombreVar;

									var l7="// Guardando la referencia al this del objeto para la llamada al constructor "+nombreVar;
									var temp5 = this.c3d.getTemporal();
									var l8 = "+, p, 0, "+ temp5+";";
									var temp6 = this.c3d.getTemporal();
									var l9 = "=>, "+temp5+", "+ temp6+", stack; //apuntador al heap de "+ nombreVar;
									var temp7 = this.c3d.getTemporal();
									var l10 = "=>, "+temp6+", "+temp7+", heap; //posicion real donde incia el objeto "+nombreVar;
									var temp8 = this.c3d.getTemporal();
									var l11= "+, "+temp7+", "+posVar+", "+ temp8+"; // pos real donde incial el objeto "+ nombreVar;
									
									var temp9 = this.c3d.getTemporal();

									//var l12 = "+, p, "+temp8+", "+temp9+"; // tamanho de la funcion actual "+ metodo; ///aaaaaaaaaaaaa
									var l12 = "+, p, "+sizeFuncActual+", "+temp9+"; // tamanho de la funcion actual "+ metodo; ///aaaaaaaaaaaaa
									var temp10 = this.c3d.getTemporal();
									var l13 = "+, "+temp9+", 0, "+temp10 +"; // pos del this para la nueva instancia de "+ nombreVar;
									var l14 = "<=, "+temp10+", "+temp8+", stack; //guaradndo el puntero del this en el stack ";
									
									this.c3d.addCodigo("// ----------- Instancia a un atributo --------------");
									this.c3d.addCodigo(l1);
									this.c3d.addCodigo(l2);
									this.c3d.addCodigo(l3);
									this.c3d.addCodigo(l4);
									this.c3d.addCodigo(l5);
									this.c3d.addCodigo(l6);
								    this.c3d.addCodigo("");
									this.c3d.addCodigo(l7);
									this.c3d.addCodigo(l8);
									this.c3d.addCodigo(l9);
									this.c3d.addCodigo(l10);
									this.c3d.addCodigo(l11);
									this.c3d.addCodigo("");
									this.c3d.addCodigo(l12);
									this.c3d.addCodigo(l13);
									this.c3d.addCodigo(l14);
									this.c3d.addCodigo("");

									// Verificar si posee parametros

									if(noParametros!= 0){
										this.c3d.addCodigo("// Asignando parametros  ");
										var expresionTemporal;
										var cont=1;
										for(var j =0; j< parametrosInstancia.length; j++){
											expresionTemporal = parametrosInstancia[j];
											var temp1_1 = this.c3d.getTemporal();
											var l1_1= "+, p, "+sizeFuncActual+", "+temp1_1+"; // size de funcion actual";
											var temp2_1= this.c3d.getTemporal();
											var l2_1= "+, "+temp1_1+", "+cont+", "+temp2_1+"; //pos del parametro "+ cont;
											cont++;
											this.c3d.addCodigo(l1_1);
											this.c3d.addCodigo(l2_1);
											var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
											var l3_1="";
											if(retExpresion.tipo.toUpperCase() != "NULO"){
												l3_1= "<=, "+temp2_1+", "+retExpresion.valor+", stack; // asignado al stack el parametro";
												this.c3d.addCodigo(l3_1);
											} 
											
										}

									}else{
										this.c3d.addCodigo("// No posee parametros ");
									}
									
									var l15= "+, p, "+sizeFuncActual+", p; // simulando cambio de ambito";
									var l16 = "call, , , "+firmMetodo+";";
									var l17 = "-, p, "+sizeFuncActual+", p; // regresando al ambito acutal";
									

									this.c3d.addCodigo(l15);
									this.c3d.addCodigo(l16);
									this.c3d.addCodigo(l17);
									this.c3d.addCodigo("");
								}else{
									errores.insertarError("Semantico","La variable "+ nombreVar+", no existe");

								}

							}else{
								// se realizara una instancia de una vairable local
								console.log("INSATANCIA DE VAIRABLEA LOCAL");

                                var posVariable = this.tablaSimbolos.obtenerPosLocal(nombreVar,ambitos);
								if(posVariable!= -1){
									var temp1= this.c3d.getTemporal();
									var l1 = "+, p, "+ posVariable+", "+ temp1+"; // pos de "+ nombreVar;
									var l2 = "<=, "+temp1+", h, stack; //guardando referencia del heap para el objeto "+ nombreVar;
									var temp2 = this.c3d.getTemporal();
									var l3 = "+, h, 1, "+temp2+"; // guardo la posicion donde inicia el objeto ";
									var l4 = "<=, h, "+temp2+", heap; // guardando donde es que inicia el objeto dentro del heap";
									var l5 = "+, h, 1, h; // sumando al heap la posicion que usamos extra para el doble apuntador ";
									var l6 = "+, h, "+sizeClase+", h; // reservando espacio para el objeto "+ nombreVar;
									var l7 = "//Ingresando referencia al this del objeto "+ nombreVar;
									var temp3 =this.c3d.getTemporal();
									var l8 = "+, p, "+posVariable+", "+temp3+"; // pos de "+nombreVar;
									var temp4 = this.c3d.getTemporal();
									var l9 = "=>, "+temp3+", "+temp4+", stack; // obteniendo apuntador de "+ nombreVar;
									var temp5 = this.c3d.getTemporal();
									var l10 = "+, p, "+ sizeFuncActual+", "+ temp5+"; // simulando cambio de ambito";
									var temp6 = this.c3d.getTemporal();
									var l11 = "+, "+temp5+", 0, "+temp6+"; //pos del this de "+nombreVar;
									var l12 = "<=, "+temp6+", "+temp4+", stack; // insertando apuntador del heap al stack del obeto "+ nombreVar;

									this.c3d.addCodigo("// ----------- Instancia a una variable local --------------");
									this.c3d.addCodigo(l1);
									this.c3d.addCodigo(l2);
									this.c3d.addCodigo(l3);
									this.c3d.addCodigo(l4);
									this.c3d.addCodigo(l5);
									this.c3d.addCodigo(l6);
									this.c3d.addCodigo(l7);
									this.c3d.addCodigo(l8);
									this.c3d.addCodigo(l9);
									this.c3d.addCodigo(l10);
									this.c3d.addCodigo(l11);
									this.c3d.addCodigo(l12);
								
									if(noParametros!= 0){
										this.c3d.addCodigo("// Asignando parametros  ");
										var expresionTemporal;
										var cont=1;
										for(var j =0; j< parametrosInstancia.length; j++){
											expresionTemporal = parametrosInstancia[j];
											var temp1_1 = this.c3d.getTemporal();
											var l1_1= "+, p, "+sizeFuncActual+", "+temp1_1+"; // size de funcion actual";
											var temp2_1= this.c3d.getTemporal();
											var l2_1= "+, "+temp1_1+", "+cont+", "+temp2_1+"; //pos del parametro "+ cont;
											cont++;
											var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
											var l3_1="";
											this.c3d.addCodigo(l1_1);
											this.c3d.addCodigo(l2_1);
											if(retExpresion.tipo.toUpperCase() != "NULO"){
												l3_1= "<=, "+temp2_1+", "+retExpresion.valor+", stack; // asignado al stack el parametro";
												this.c3d.addCodigo(l3_1);
											} 
											
										}

									}else{
										this.c3d.addCodigo("// No posee parametros ");
									}
									var l15= "+, p, "+sizeFuncActual+", p; // simulando cambio de ambito";
									var l16 = "call, , , "+firmMetodo+";";
									var l17 = "-, p, "+sizeFuncActual+", p; // regresando al ambito acutal";
									this.c3d.addCodigo(l15);
									this.c3d.addCodigo(l16);
									this.c3d.addCodigo(l17);
									this.c3d.addCodigo("");
								
								}else{
									errores.insertarError("Semantico","La variable "+ nombreVar+", no existe");
								}
								
							}//fin else de que la instancia es local

						}else{
							errores.insertarError("Semantico", "No existe "+nombreVar);
						}
					}else{

						console.log("La variable  "+ nombreVar+", es de tipo "+tipoVar+", imposible de instanciar con tipo "+ nombreClaseInstanciar);
						errores.insertarError("Semantico", "La variable  "+ nombreVar+", es de tipo "+tipoVar+", imposible de instanciar con tipo "+ nombreClaseInstanciar+", o El constructor no coincide con los parametros ");

					}
	
					break;
				}


				case 3:{
					//|ACCESO SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($1,$2,$3,3); $$=a;} //3
					var elementoAsignar = nodo.elementoAsignacion;
					var simbIgual = nodo.simboloIgual;
					var expresionAsig = nodo.valorAsignacion;

					var retAcceso = this.resolverAcceso(elementoAsignar,ambitos,clase,metodo);
					if(retAcceso instanceof EleRetorno){
						if(retAcceso.tipo.toUpperCase()!="NULO"){
							if(!retAcceso.esReferenciaNula()){
								this.asignarPorSimboloIgual(retAcceso,simbIgual,expresionAsig,ambitos,clase,metodo);
							}else{
								errores.insertarError("Semantico", "Referencia nula, no se puede realizar asignacion al acceso");
							}
						}else{
							errores.insertarError("Semantico", "Ha ocurrido un error al resolver el acceso para la asigncicon, valores nulos");	
						}
					}else{
						errores.insertarError("Semantico", "Ha ocurrido un error al resolver el acceso para la asigncicon");
					}
					break;
				}

				case 8:{
					//|este punto id SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($3,$4,$5,8); $$=a;}//8
					var idAsignacion = nodo.elementoAsignacion;
					var signoIgual = nodo.simboloIgual;
					var expresionAsig = nodo.valorAsignacion;
					var id = new t_id();
					id.setValorId(idAsignacion);
					var nodoEste = new objetoEste();
					nodoEste.setValores(id);
					var retEste = this.resolverEste(nodoEste,ambitos, clase, metodo);
					if(retEste instanceof EleRetorno){
						if(retEste.tipo.toUpperCase()!= "NULO"){
							this.asignarPorSimboloIgual(retEste,signoIgual,expresionAsig,ambitos,clase,metodo);
						}else{
							errores.insertarError("Semantico", "Ha ocurrido un error al resolver Este.id");
						}
					}else{
						errores.insertarError("Semantico", "Ha ocurrido un error al resolver para la asignacion de un Este.id");
					}
					break;
				}

				case 10:{
					//|este punto ACCESO SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($3,$4,$5,10); $$=a;}//10
					var elemento = nodo.elementoAsignacion;
					var signoIgual = nodo.simboloIgual;
					var expresionAsig = nodo.valorAsignacion;
					var nodoEste = new objetoEste();
					nodoEste.setValores(elemento);
					var retEste = this.resolverEste(nodoEste,ambitos, clase, metodo);
					if(retEste instanceof EleRetorno){
						if(retEste.tipo.toUpperCase()!= "NULO"){
							this.asignarPorSimboloIgual(retEste,signoIgual,expresionAsig,ambitos,clase,metodo);
						}else{
							errores.insertarError("Semantico", "Ha ocurrido un error al resolver Este.id");
						}
					}else{
						errores.insertarError("Semantico", "Ha ocurrido un error al resolver para la asignacion de un Este.id");
					}
					break;
				}


				case 15:{
					//|VALOR_PUNTERO igual EXPRESION //15 { var a = new Asignacion(); a.setValores($1,$2,$3,15); $$=a;} ;
				

					break;
				}


				case 11:{
					//|este punto ACCESO igual INSTANCIA { var a = new Asignacion(); a.setValores($3,$4,$5,11); $$=a;}//11
					var elemento = nodo.elementoAsignacion;
					var expresionAsig = nodo.valorAsignacion;
					var nodoEste = new objetoEste();
					nodoEste.setValores(elemento);
					var resultadoEste = this.resolverEste(nodoEste,ambitos,clase,metodo);
					if(resultadoEste instanceof EleRetorno){
						if(resultadoEste.tipo.toUpperCase()!="NULO"){

						}else{
							errores.insertarError("Semantico", "Ha ocurrido un error para resolver la expresion de este.acceso, nulo");
						}

					}else{
						errores.insertarError("Semantico", "Ha ocurrido un error al resolver para la expresion este.acceso");
					}
					break;
				}

				case 4:{
					//|ACCESO igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,4); $$=a;}//4
					var elemento = nodo.elementoAsignacion;
					var expresionAsig = nodo.valorAsignacion;


					break;
				}

				case 9:{
					//|este punto id igual INSTANCIA { var a = new Asignacion(); a.setValores($3,$4,$5,9); $$=a;}//9
					var elemento = nodo.elementoAsignacion;
					var expresionAsig = nodo.valorAsignacion;


					break;
				}
				

			}

			break;
		}//fin asignacion


		case "IMPRIMIR":{
			var resultado = this.resolverExpresion(nodo.expresionImprimir,ambitos,clase, metodo);
			if(resultado instanceof EleRetorno){
				if(resultado.tipo.toUpperCase() != "NULO"){
					if(resultado.tipo.toUpperCase() == "ENTERO" || resultado.tipo.toUpperCase() == "BOOLEANO"){
						var l1 = "print(\"%d\", "+ resultado.valor +");";
						this.c3d.addCodigo(l1);
					}else if(resultado.tipo.toUpperCase() == "DECIMAL"){
						var l1 = "print(\"%f\", "+ resultado.valor +");";
						this.c3d.addCodigo(l1);

					}else if(resultado.tipo.toUpperCase() == "CARACTER"){
						var l1 = "print(\"%c\", "+ resultado.valor +");";
						this.c3d.addCodigo(l1);

					}else if(resultado.tipo.toUpperCase() == "CADENA"){
						this.c3d.addCodigo("print(\"%s\", "+resultado.valor+");");
					}
				}
			}else{
				errores.insertarError("Semantico","Ha ocurrido un error al resolver para imprimir");
			}
			break;
		}// fin de imprimir


		case "CONCATENAR":{
			this.funcionConcatenar(nodo,ambitos,clase,metodo);
			break;
		}

		case "REPETIR_MIENTRAS":{
            console.log("entre aun repetir mientras");
			var expresionCiclo = nodo.expresion;
			var cuerpoCiclo = nodo.cuerpo;
			this.c3d.addCodigo("// Resolviendo un repetur mientras");
			var etiqCiclo = this.c3d.getEtiqueta();
			this.c3d.addCodigo("jmp, , ,"+etiqCiclo+"; //regresando a la etiqueral del ciclo repetir- mientras");//
			this.c3d.addCodigo(etiqCiclo+":");
			var retExpresion = this.resolverExpresion(expresionCiclo,ambitos,clase, metodo);
			if(retExpresion instanceof nodoCondicion){
				this.c3d.addCodigo(retExpresion.codigo);
				this.c3d.addCodigo(retExpresion.getEtiquetasVerdaderas());
				ambitos.addRepetirMientras();
				if(cuerpoCiclo!=0){
					var sentTemp;
					for(var i = 0; i<cuerpoCiclo.length; i++){
						sentTemp= cuerpoCiclo[i];
						this.escribir3D(sentTemp,ambitos,clase,metodo);
					}
					this.c3d.addCodigo("jmp, , ,"+etiqCiclo+"; //regresando a la etiqueral del ciclo repetir mientras");
					this.c3d.addCodigo(retExpresion.getEtiquetasFalsas());
				}
				ambitos.ambitos.shift();
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion para repetir mientras");
			}
			break;
		}//fin repetir mientras

 

		case "HACER_MIENTRAS":{
			var expCiclo = nodo.expresion;
			var cuerpoCiclo = nodo.cuerpo;
			this.c3d.addCodigo("// ---------- Resolver Hacer Mientras ----------- ");
			var etiqCiclo = this.c3d.getEtiqueta();
			var etiqBreak = this.c3d.getEtiqueta();
			var etiqContinue = this.c3d.getEtiqueta();
			etiquetasBreak.insertarEtiqueta(etiqBreak);
			etiquetasContinuar.insertarEtiqueta(etiqContinue);
			this.c3d.addCodigo(etiqCiclo+":");
			ambitos.addHacerMientras();
			if(cuerpoCiclo!=0){
				var sentTemp;
				for(var i = 0; i<cuerpoCiclo.length; i++){
					sentTemp= cuerpoCiclo[i];
					this.escribir3D(sentTemp,ambitos,clase,metodo);
				}
				this.c3d.addCodigo(etiqContinue+": //etiqueta del conituar");
				var retExpresion = this.resolverExpresion(expCiclo,ambitos,clase, metodo);
				if(retExpresion instanceof nodoCondicion){
					this.c3d.addCodigo(retExpresion.codigo);
					this.c3d.addCodigo(retExpresion.getEtiquetasVerdaderas());
					this.c3d.addCodigo("jmp, , , "+etiqCiclo+";");
					this.c3d.addCodigo(retExpresion.getEtiquetasFalsas());
				    this.c3d.addCodigo(etiqBreak+":");
					ambitos.ambitos.shift();
					etiquetasBreak.eliminarActual();
					etiquetasContinuar.eliminarActual();
				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion para repetir mientras");
				}
	
			}

			break;
		}


		case "REPETIR":{
			var expCiclo = nodo.expresion;
			var cuerpoCiclo = nodo.cuerpo;
			this.c3d.addCodigo("// ---------- Resolver Repetir ----------- ");
			var etiqCiclo = this.c3d.getEtiqueta();
			var etiqBreak = this.c3d.getEtiqueta();
			var etiqContinue = this.c3d.getEtiqueta();
			etiquetasBreak.insertarEtiqueta(etiqBreak);
			etiquetasContinuar.insertarEtiqueta(etiqContinue);
			this.c3d.addCodigo(etiqCiclo+":");
			ambitos.addRepetir();
			if(cuerpoCiclo!=0){
				var sentTemp;
				for(var i = 0; i<cuerpoCiclo.length; i++){
					sentTemp= cuerpoCiclo[i];
					this.escribir3D(sentTemp,ambitos,clase,metodo);
				}
				this.c3d.addCodigo(etiqContinue+": //etiqueta del conituar");
				var retExpresion = this.resolverExpresion(expCiclo,ambitos,clase, metodo);
				if(retExpresion instanceof nodoCondicion){
					this.c3d.addCodigo(retExpresion.codigo);
					this.c3d.addCodigo(retExpresion.getEtiquetasFalsas());
					this.c3d.addCodigo("jmp, , , "+etiqCiclo+";");
					this.c3d.addCodigo(retExpresion.getEtiquetasVerdaderas());
				    this.c3d.addCodigo(etiqBreak+":");
					ambitos.ambitos.shift();
					etiquetasBreak.eliminarActual();
					etiquetasContinuar.eliminarActual();
				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion para repetir mientras");
				}
	
			}

			break;
			

			break;
		}

		case "ENCICLAR":{

			//if(nodo.esValido()){
				var cuerpoCiclo = nodo.cuerpo;
				var etiqCiclo = this.c3d.getEtiqueta();
				var etiqBreak = this.c3d.getEtiqueta();
				//var etiqContinue = this.c3d.getEtiqueta();
				this.c3d.addCodigo(etiqCiclo+":");
				etiquetasBreak.insertarEtiqueta(etiqBreak);
				etiquetasContinuar.insertarEtiqueta(etiqCiclo);
				ambitos.addEnciclar();
				var sentTemp;
				for(var i = 0; i<cuerpoCiclo.length; i++){
					sentTemp= cuerpoCiclo[i];
					this.escribir3D(sentTemp,ambitos,clase,metodo);
				}
				this.c3d.addCodigo("jmp, , , "+ etiqCiclo+";");
				this.c3d.addCodigo(etiqBreak+":");
				ambitos.ambitos.shift();
				etiquetasBreak.eliminarActual();
				etiquetasContinuar.eliminarActual();

		//	}else{
			//	errores.insertarError("Semantico", "Un ciclo Enciclar, debe traer por fuerza una sentencia romper");
		//	}
			break;
		}


		case "CONTADOR":{
			var expresionContador = nodo.expresion;
			var cuerpoCiclo = nodo.cuerpo;
			var resultadoExpresion = this.resolverExpresion(expresionContador,ambitos,clase,metodo);
			if(resultadoExpresion instanceof EleRetorno){
				if(resultadoExpresion.tipo.toUpperCase() == "ENTERO"){
					var temp1 = this.c3d.getTemporal();
					var etiq1 = this.c3d.getEtiqueta();
					var etiq2 = this.c3d.getEtiqueta();
					var etiq3 = this.c3d.getEtiqueta();
					var etiq4 = this.c3d.getEtiqueta();
					var etiqContinuar = this.c3d.getEtiqueta();
					var etiqBreak = this.c3d.getEtiqueta();
					etiquetasBreak.insertarEtiqueta(etiqBreak);
					etiquetasContinuar.insertarEtiqueta(etiqContinuar);
					ambitos.addContador();

					var l1= "+, 0, 0, "+temp1+"; // variable de control para el ciclo contador";
					var l2 = "jg, "+resultadoExpresion.valor+", 0, "+etiq1+";";
					var l3 = "jmp, , , "+ etiq2+";";
					var l4 = etiq1+":";
					var l5 = "jl, "+temp1+", "+resultadoExpresion.valor+", "+etiq3+";";
					var l6 = "jmp, , , "+etiq4+";";
					var l7 = etiq3+":";
					this.c3d.addCodigo(" // ------------------ Inicio ciclo contador -----------------");
					this.c3d.addCodigo(l1);
					this.c3d.addCodigo(l2);
					this.c3d.addCodigo(l3);
					this.c3d.addCodigo(l4);
					this.c3d.addCodigo(l5);
					this.c3d.addCodigo(l6);
					this.c3d.addCodigo(l7);
					var sentTemp;
					for(var i = 0; i<cuerpoCiclo.length; i++){
						sentTemp= cuerpoCiclo[i];
						this.escribir3D(sentTemp,ambitos,clase,metodo);
					}
					var l8 = etiqContinuar+":";
					var l9 = "+, "+temp1+", 1, "+temp1+"; // incrementando en uno la vairable del ciclo contador";
					var l10 = "jmp, , , "+etiq1+"; // retornando al ciclo continuar";
					var l11 = etiq4+":";
					var l12 = etiq2+":";
					var l13 = etiqBreak+":";

					this.c3d.addCodigo(l8);
					this.c3d.addCodigo(l9);
					this.c3d.addCodigo(l10);
					this.c3d.addCodigo(l11);
					this.c3d.addCodigo(l12);
					this.c3d.addCodigo(l13);
					this.c3d.addCodigo(" // ------------------ Fin ciclo contador -----------------");
					ambitos.ambitos.shift();
					etiquetasBreak.eliminarActual();
					etiquetasContinuar.eliminarActual();


				}else{
					errores.insertarError("Semantico", "La variable pivote para un ciclo contador debe de ser de tipo entero no, "+ resultadoExpresion.tipo);
				}

			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error al resolver un numero pivote para el ciclo contador");
			}

			
			break;
		}


		case "REPETIR_CONTANDO":{

			var declaVar = nodo.declaracion;
			var desde = nodo.expresionDesde;
			var hasta = nodo.expresionHasta;
			var cuerpoCiclo = nodo.cuerpo;

			//this.c3d.addCodigo("// ----------------  Inicio Repetir Contando ----------------------");
			var retDesde = this.resolverExpresion(desde,ambitos,clase,metodo);
			var retHasta = this.resolverExpresion(hasta,ambitos,clase,metodo);
			if(retDesde instanceof EleRetorno){
				if(retHasta instanceof EleRetorno){
					if (retDesde.tipo.toUpperCase() == "ENTERO"){
						if(retHasta.tipo.toUpperCase() == "ENTERO"){
							//asignamos vairable con el valor de desde
							ambitos.addRepetirContando();
							var nombreVar = declaVar.nombreVariable;
							var posVar = this.tablaSimbolos.obtenerPosLocal(nombreVar, ambitos);
							if(posVar!=-1){
								var etiq1 = this.c3d.getEtiqueta();
								var etiq2 = this.c3d.getEtiqueta();
								var etiq3 = this.c3d.getEtiqueta();
								var etiq4 = this.c3d.getEtiqueta();
								var etiq5 = this.c3d.getEtiqueta();
								var etiq6 = this.c3d.getEtiqueta();
								var etiq7 = this.c3d.getEtiqueta();
								var etiq8 = this.c3d.getEtiqueta();
								var etiqContinue = this.c3d.getEtiqueta();
								var etiqBreak = this.c3d.getEtiqueta();
								etiquetasBreak.insertarEtiqueta(etiqBreak);
								etiquetasContinuar.insertarEtiqueta(etiqContinue);
								

								var temp1 = this.c3d.getTemporal();
								var l1 = "+, P, "+posVar+", "+temp1+"; // pos de "+ nombreVar;
								var l2 = "<=, "+temp1+", "+retDesde.valor+", stack; // asignando con el valor de desde la vairable "+ nombreVar;
								var temp2 = this.c3d.getTemporal();
								var l3 = "=>, "+temp1+", "+temp2+", stack; // obteniendo el valor de  desde "+ nombreVar;
								var l4 = "jne, "+temp2+", "+ retHasta.valor+", "+etiq1+";";
								var l5 = "jmp, , , "+ etiq2+";";
								var l6 = etiq1+":";
								var l7 = "jl, "+temp2+", "+retHasta.valor+", "+etiq3+";";
								var l8 = "jmp, , , "+ etiq4+";";
								var temp3 = this.c3d.getTemporal();
								var l9 = etiq3+":";
								var l10 = "+, 1, 0, "+temp3+";";
								var l11 = "jmp, , , "+ etiq5+";";
								var l12 = etiq4+":";
								var l13 = "+, -1, 0, "+temp3+";";
								var l14 = "jmp, , , "+ etiq5+";";
								var l15= etiq5+":";
								var temp4 = this.c3d.getTemporal();
								var l16 = "-, "+retHasta.valor+", "+temp2+", "+temp4+";";
								var l17 = "*, "+temp4+", "+temp3+", "+temp4+";";
								var temp5 = this.c3d.getTemporal();
								var l18 = "+, 0, 0, "+temp5+"; // iniciando la viairrble pivote del ciclo repetir contando";
								var l19 = etiq6+":";
								var l20 = "jle, "+temp5+", "+temp4+", "+etiq7+";";
								var l21 = "jmp, , , "+etiq8+";";
								var l22 = etiq7+":";
								this.c3d.addCodigo(" // ------------------ Inicio ciclo repetir contando -----------------");
								this.c3d.addCodigo(l1);
								this.c3d.addCodigo(l2);
								this.c3d.addCodigo(l3);
								this.c3d.addCodigo(l4);
								this.c3d.addCodigo(l5);
								this.c3d.addCodigo(l6);
								this.c3d.addCodigo(l7);
								this.c3d.addCodigo(l8);
								this.c3d.addCodigo(l9);
								this.c3d.addCodigo(l10);
								this.c3d.addCodigo(l11);
								this.c3d.addCodigo(l12);
								this.c3d.addCodigo(l13);
								this.c3d.addCodigo(l14);
								this.c3d.addCodigo(l15);
								this.c3d.addCodigo(l16);
								this.c3d.addCodigo(l17);
								this.c3d.addCodigo(l18);
								this.c3d.addCodigo(l19);
								this.c3d.addCodigo(l20);
								this.c3d.addCodigo(l21);
								this.c3d.addCodigo(l22);
								var sentTemp;
								for(var i = 0; i<cuerpoCiclo.length; i++){
									sentTemp= cuerpoCiclo[i];
									this.escribir3D(sentTemp,ambitos,clase,metodo);
								}
								var l23 = etiqContinue+":";
								var l24 = "+, "+temp2+", "+temp3+", "+temp2+"; // nuevo valor de la variable del ciclo "+nombreVar;
								var l25 = "+, "+temp5+", 1, "+temp5+";";
								var l26 = "<=, "+temp1+", "+temp2+", stack; // asignando a "+ nombreVar;
								var l27 = "jmp, , , "+ etiq6+";"
								var l28 = etiq8+":";
								var l29 = etiq2+":";
								var l30 = etiqBreak+":";

								this.c3d.addCodigo(l23);
								this.c3d.addCodigo(l24);
								this.c3d.addCodigo(l25);
								this.c3d.addCodigo(l26);
								this.c3d.addCodigo(l27);
								this.c3d.addCodigo(l28);
								this.c3d.addCodigo(l29);
								this.c3d.addCodigo(l30);
								this.c3d.addCodigo(" // ------------------ Fin ciclo repetir contando-----------------");
								ambitos.ambitos.shift();
								etiquetasBreak.eliminarActual();
								etiquetasContinuar.eliminarActual();

							}else{
								errores.insertarError("Semantico", "La vairable "+ nombreVar+", no existe en el ambito local");
							}
						}else{
							errores.insertarError("Semantico", "La expresion hasta debe de ser de tipo entero "+ retHasta.tipo);
						}
					}else{
						errores.insertarError("Semantico", "La expresion desde debe de ser de tipo entero "+ retDesde.tipo);
					}
				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion Hasta para repetir contando");
				}
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion Desde para repetir contando");
			}



			break;
		}


		case "DOBLE_CONDICION":{
			var cond1 = nodo.expresion1;
			var cond2 = nodo.expresion2;
			var cuerpoCiclo = nodo.cuerpo;
			var temp3 = this.c3d.getTemporal();
			var etiq0 = this.c3d.getEtiqueta();
			var temp1 = this.c3d.getTemporal();
					var temp2 = this.c3d.getTemporal();
					var etiq1 = this.c3d.getEtiqueta();
					var etiq2 = this.c3d.getEtiqueta();
					var etiq3 = this.c3d.getEtiqueta();
					var etiq4 = this.c3d.getEtiqueta();
					var etiq5 = this.c3d.getEtiqueta();
					var etiq6 = this.c3d.getEtiqueta();
					//var etiq7 = this.c3d.getEtiqueta();
					var etiq8 = this.c3d.getEtiqueta();
					var etiqContinue = this.c3d.getEtiqueta();
					var etiqBreak = this.c3d.getEtiqueta();
					etiquetasBreak.insertarEtiqueta(etiqBreak);
					etiquetasContinuar.insertarEtiqueta(etiqContinue);
					ambitos.addCicloX();
					this.c3d.addCodigo(" // ------------------ Inicio ciclo X -----------------");
			var l1= "+, 0, 0, "+temp3+"; // vairable comparacion";
			this.c3d.addCodigo(l1);
			var l2 = etiq0+":";
			this.c3d.addCodigo(l2);
			
			var resCond1 = this.resolverExpresion(cond1, ambitos, clase, metodo);
			var resCond2 = this.resolverExpresion(cond2, ambitos, clase, metodo);

			if(resCond1 instanceof nodoCondicion){
				if(resCond2 instanceof nodoCondicion){
					
					//this.c3d.addCodigo(l2);
					this.c3d.addCodigo(resCond1.codigo);
					this.c3d.addCodigo(resCond1.getEtiquetasVerdaderas());
					this.c3d.addCodigo("+, 1, 0, "+temp1+"; // Primera condicion es verdadera");
					this.c3d.addCodigo("jmp, , , "+etiq1+";");
					this.c3d.addCodigo(resCond1.getEtiquetasFalsas());
					this.c3d.addCodigo("+, 0, 0, "+temp1+"; //primera condicion es falsa");
					this.c3d.addCodigo("jmp, , , "+etiq1+";");
					this.c3d.addCodigo(etiq1+":");
					this.c3d.addCodigo(resCond2.codigo);
					this.c3d.addCodigo(resCond2.getEtiquetasVerdaderas());
					this.c3d.addCodigo("+, 1, 0, "+temp2+"; // segunda condicion es verdadera");
					this.c3d.addCodigo("jmp, , , "+etiq2+";");
					this.c3d.addCodigo(resCond2.getEtiquetasFalsas());
					this.c3d.addCodigo("+, 0, 0, "+temp2+"; // segunda concion es falsa");
					this.c3d.addCodigo("jmp, , , "+etiq2+";");
					this.c3d.addCodigo(etiq2+":");
					this.c3d.addCodigo("jne, "+temp1+", "+temp2+", "+etiq3+";");
					this.c3d.addCodigo("jmp, , , "+etiq4+";");
					this.c3d.addCodigo(etiq3+":");
					this.c3d.addCodigo("je, "+temp3+", 0, "+etiq5+";");
					this.c3d.addCodigo("jmp, , , "+etiq6+";");
					this.c3d.addCodigo(etiq5+":");
					var sentTemp;
					for(var i = 0; i<cuerpoCiclo.length; i++){
						sentTemp= cuerpoCiclo[i];
						this.escribir3D(sentTemp,ambitos,clase,metodo);
					}
					this.c3d.addCodigo(etiqContinue+": // continuar doble condicion");
					this.c3d.addCodigo("+, 1, 0, "+temp3+";");
					this.c3d.addCodigo("jmp, , , "+etiq0+";");

					this.c3d.addCodigo(etiq4+":");
					this.c3d.addCodigo("je, "+temp3+", 1, "+etiq5+";");
					this.c3d.addCodigo("jmp, , , "+etiq8+";");
					this.c3d.addCodigo(etiq8+":");
					this.c3d.addCodigo(etiq6+":");
					this.c3d.addCodigo(etiqBreak+": // break doble condicion");
					this.c3d.addCodigo(" // ------------------ Fin ciclo X -----------------");
					ambitos.ambitos.shift();
					etiquetasBreak.eliminarActual();
					etiquetasContinuar.eliminarActual();
				}else{
					errores.insertarError("Semantico", "La segunda expresion para el ciclo x,  no es una condicion");
				}
			}else{
				errores.insertarError("Semantico", "La primera expresion para el ciclo x,  no es una condicion");
			}
			break;
		}

		case "SI":{
			var expresionSi = nodo.expresion;
			var sentVerdaderas = nodo.sentV;
			var sentFalsas = nodo.sentF;
			var etiqSalida = this.c3d.getEtiqueta();
			var retExpresion = this.resolverExpresion(expresionSi,ambitos, clase, metodo);

			if(retExpresion instanceof nodoCondicion){
				this.c3d.addCodigo(retExpresion.codigo);
				this.c3d.addCodigo(retExpresion.getEtiquetasVerdaderas());
				if(sentVerdaderas!= 0){
					ambitos.addSi();
					var sentTemp;
					for(var i = 0; i<sentVerdaderas.length; i++){
						sentTemp= sentVerdaderas[i];
						this.escribir3D(sentTemp,ambitos,clase,metodo);
					}
					ambitos.ambitos.shift();
				}
				this.c3d.addCodigo("jmp, , , "+ etiqSalida+"; // salida del if");
				this.c3d.addCodigo(retExpresion.getEtiquetasFalsas());
				if(sentFalsas!=0){
					ambitos.addElse();
					var sentTemp;
					for(var i = 0; i<sentFalsas.length; i++){
						sentTemp= sentFalsas[i];
						this.escribir3D(sentTemp,ambitos,clase,metodo);
					}
					ambitos.ambitos.shift();
				}
				this.c3d.addCodigo(etiqSalida+":");

			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error al resolver la expreison para SI");
			}

			break;
		}


		case "SELECCIONA":{

			var expSelect = nodo.expresion;
			var listaCasos = nodo.casos;
			var casoDefecto = nodo.defecto;
			
			this.c3d.addCodigo("// --------------------- Inicio evaluar_si --------------------------");
			var etiqBreak = this.c3d.getEtiqueta();
			etiquetasBreak.insertarEtiqueta(etiqBreak);
			//1 Resolver la expresion pivote del selecciona
			var retExpresion = this.resolverExpresion(expSelect,ambitos,clase,metodo);
			if(retExpresion instanceof EleRetorno){
				if(retExpresion.tipo.toUpperCase() != "NULO"){
					//2. Resolver las expresion de todos los casos
					var bandera = true;
					var casoTemporal, resExpCaso, etiqTemp;
					var valoresCasos = [];
					var casosEtiquetas = [];
					for(var i =0; i<listaCasos.length; i++){
						casoTemporal = listaCasos[i];
						resExpCaso = this.resolverExpresion(casoTemporal.expresion, ambitos,clase,metodo);
						if(resExpCaso instanceof EleRetorno){
							if(resExpCaso.tipo.toUpperCase() == retExpresion.tipo.toUpperCase()){
								bandera = bandera && true;
								etiqTemp = this.c3d.getEtiqueta();
								valoresCasos.push(resExpCaso.valor);
								casosEtiquetas.push(etiqTemp);
							}else{
								etiqTemp = this.c3d.getEtiqueta();
								valoresCasos.push(resExpCaso.valor);
								casosEtiquetas.push(etiqTemp);
								bandera=false;
								//errores.insertarError("Semantico", "La expresion del caso no. "+ (i+1)+", es de tipo "+ resExpCaso.tipo+" y tiene que ser de tipo "+ retExpresion.tipo);
							}
						}else{
							bandera = false;
							//errores.insertarError("Semantico", "Expresion no validad para el caso no. "+(i+1)+", de Evaluar_Si");
						}
					}// fin del ciclo donde se calcula todos los valores

					if(/*bandera== true && */
						valoresCasos.length == listaCasos.length &&
						valoresCasos.length == casosEtiquetas.length){
						//3 Generar todas las condiciones  para la lista de casos
						var valorTemporal, etiqVTemp, etiqF;
						for(var i =0; i<valoresCasos.length; i++){
							valorTemporal = valoresCasos[i];
							etiqVTemp = casosEtiquetas[i];
							etiqF= this.c3d.getEtiqueta();
							this.c3d.addCodigo("je, "+ retExpresion.valor+", "+valorTemporal+", "+etiqVTemp+"; // verdadero del caso "+ (i+1));
							this.c3d.addCodigo("jmp, , , "+ etiqF+"; // falsa del caso "+ (i+1));
							this.c3d.addCodigo(etiqF+":");
						}
						//4 escribir codigo para etiquetea defecto
						var etiqDefecto= this.c3d.getEtiqueta();
						this.c3d.addCodigo("jmp, , , "+etiqDefecto+"; // ir al por defecto");

						//5. Escribir el codigo de los casos
					    var cuerpoCaso, sentTemporal;
						for(var i =0; i<listaCasos.length; i++){
							casoTemporal = listaCasos[i];
							etiqVTemp = casosEtiquetas[i];
							cuerpoCaso = casoTemporal.cuerpo;
							this.c3d.addCodigo(etiqVTemp+":");
							ambitos.addCaso();
							if(cuerpoCaso!=0){
								for(var j=0; j<cuerpoCaso.length; j++){
									sentTemporal = cuerpoCaso[j];
									this.escribir3D(sentTemporal,ambitos,clase,metodo);
								}
							}
							ambitos.ambitos.shift();	
						}

						// 6. escribir cuerpo de defecto
						this.c3d.addCodigo(etiqDefecto+":");
						ambitos.addDefecto();
						if(casoDefecto!=0){
							for(var j=0; j<casoDefecto.length; j++){
								sentTemporal = casoDefecto[j];
								this.escribir3D(sentTemporal,ambitos,clase,metodo);
							}
						}
						ambitos.ambitos.shift();
						this.c3d.addCodigo(etiqBreak+": // break de evaluar _si");
						this.c3d.addCodigo("// --------------------- Fin evaluar_si --------------------------");
					}else{
						errores.insertarError("Semantico", "Tipos no valido para Evaluar_Si");
					}

				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver la expreion para Selecciona");
				}
			}else{
				errores.insertarError("Semantico", "Expresion no valida para Selecciona");
			}
			break;
		}

		case "CONTINUAR":{
			this.c3d.addCodigo("jmp, , , "+etiquetasContinuar.obtenerActual()+"; // haciendo un continuar ");
			break;
		}

		case "ROMPER":{
			this.c3d.addCodigo("jmp, , , "+etiquetasBreak.obtenerActual()+"; // haciendo un romper ");
			break;
		}

		case "LLAMADA":{

			this.llamada_funcion(nodo,ambitos,clase,metodo, 0, true);
			break;
		}

		case "RETORNO":{
			this.c3d.addCodigo("// RESOLVIENDO UN RETORNO");
			this.operarRetorno(nodo,ambitos, clase, metodo);
			break;
		}

		case "LEER_TECLADO":{
			

			break;
		}// fin de leer teclado




	}//fin switch sentencia
};

/* ---------------------------------------------- Acciones de ASignaciones ------------------------------------------------- */

generacionCodigo.prototype.crearInstancia = function(nodoOperando, expresionVar, ambitos, clase, metodo){
	var nombreClaseInstanciar =  expresionVar.getTipo();
	var parametrosInstancia = expresionVar.getParametros();
	var noParametros=0;
	if(parsInstancia==0){
		noParametros=0;
	}else{
		noParametros=parsInstancia.length;
	}
	var tipoVar = nodoOperando.tipo;
	var firmMetodo = this.tablaSimbolos.obtenerFirmaMetodo(nombreClaseInstanciar,noParametros,nombreClaseInstanciar);
	var sizeFuncActual = this.tablaSimbolos.sizeFuncion(clase,metodo);
	if(tipoVar.toUpperCase() == nombreClaseInstanciar.toUpperCase() && firmMetodo!=""){
		var sizeClase = this.tablaSimbolos.SizeClase(nombreClaseInstanciar);

	
	
	}


	//////////////////////////
	if(tipoVar.toUpperCase() == nombreClaseInstanciar.toUpperCase() && firmMetodo!=""){
		var sizeClase = this.tablaSimbolos.SizeClase(nombreClaseInstanciar);
		var esAtributo = this.tablaSimbolos.esAtributo(nombreVar,ambitos);
		
		if(esAtributo!=null){
			if(esAtributo){
				// se realizara una instancia de un atributo
				console.log("INSTANCIA DE ATRIBUTO");
				var posVar = this.tablaSimbolos.obtenerPosAtributo(nombreVar,ambitos);
				if(posVar!= -1){
					var temp = this.c3d.getTemporal();
					var l1 = "+, p, 0, "+temp+";// pos this de "+nombreVar;
					var temp2 = this.c3d.getTemporal();
					var l2= "=>, "+temp+", "+temp2+", stack; //apuntador del heap de "+ nombreVar;
					var temp3 = this.c3d.getTemporal();
					var l3 = "=>, "+temp2+", "+temp3+", heap; //posicion real del heap donde inicia "+nombreVar;
					var temp4= this.c3d.getTemporal();
					var l4 ="+, "+temp3+", "+posVar+", "+temp4+"; //pos real del atributo "+nombreVar;
					var l5 ="<=, "+temp4+", h, heap; //guardando la pos real donde inicia el objeto "+nombreVar;
					var l6 ="+, h, "+sizeClase+", h; // reservando el espacio de memoria para el nuevo objeto "+ nombreVar;

					var l7="// Guardando la referencia al this del objeto para la llamada al constructor "+nombreVar;
					var temp5 = this.c3d.getTemporal();
					var l8 = "+, p, 0, "+ temp5+";";
					var temp6 = this.c3d.getTemporal();
					var l9 = "=>, "+temp5+", "+ temp6+", stack; //apuntador al heap de "+ nombreVar;
					var temp7 = this.c3d.getTemporal();
					var l10 = "=>, "+temp6+", "+temp7+", heap; //posicion real donde incia el objeto "+nombreVar;
					var temp8 = this.c3d.getTemporal();
					var l11= "+, "+temp7+", "+posVar+", "+ temp8+"; // pos real donde incial el objeto "+ nombreVar;
					
					var temp9 = this.c3d.getTemporal();

					//var l12 = "+, p, "+temp8+", "+temp9+"; // tamanho de la funcion actual "+ metodo; ///aaaaaaaaaaaaa
					var l12 = "+, p, "+sizeFuncActual+", "+temp9+"; // tamanho de la funcion actual "+ metodo; ///aaaaaaaaaaaaa
					var temp10 = this.c3d.getTemporal();
					var l13 = "+, "+temp9+", 0, "+temp10 +"; // pos del this para la nueva instancia de "+ nombreVar;
					var l14 = "<=, "+temp10+", "+temp8+", stack; //guaradndo el puntero del this en el stack ";
					
					this.c3d.addCodigo("// ----------- Instancia a un atributo --------------");
					this.c3d.addCodigo(l1);
					this.c3d.addCodigo(l2);
					this.c3d.addCodigo(l3);
					this.c3d.addCodigo(l4);
					this.c3d.addCodigo(l5);
					this.c3d.addCodigo(l6);
					this.c3d.addCodigo("");
					this.c3d.addCodigo(l7);
					this.c3d.addCodigo(l8);
					this.c3d.addCodigo(l9);
					this.c3d.addCodigo(l10);
					this.c3d.addCodigo(l11);
					this.c3d.addCodigo("");
					this.c3d.addCodigo(l12);
					this.c3d.addCodigo(l13);
					this.c3d.addCodigo(l14);
					this.c3d.addCodigo("");

					// Verificar si posee parametros

					if(noParametros!= 0){
						this.c3d.addCodigo("// Asignando parametros  ");
						var expresionTemporal;
						var cont=1;
						for(var j =0; j< parametrosInstancia.length; j++){
							expresionTemporal = parametrosInstancia[j];
							var temp1_1 = this.c3d.getTemporal();
							var l1_1= "+, p, "+sizeFuncActual+", "+temp1_1+"; // size de funcion actual";
							var temp2_1= this.c3d.getTemporal();
							var l2_1= "+, "+temp1_1+", "+cont+", "+temp2_1+"; //pos del parametro "+ cont;
							cont++;
							this.c3d.addCodigo(l1_1);
							this.c3d.addCodigo(l2_1);
							var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
							var l3_1="";
							if(retExpresion.tipo.toUpperCase() != "NULO"){
								l3_1= "<=, "+temp2_1+", "+retExpresion.valor+", stack; // asignado al stack el parametro";
								this.c3d.addCodigo(l3_1);
							} 
							
						}

					}else{
						this.c3d.addCodigo("// No posee parametros ");
					}
					
					var l15= "+, p, "+sizeFuncActual+", p; // simulando cambio de ambito";
					var l16 = "call, , , "+firmMetodo+";";
					var l17 = "-, p, "+sizeFuncActual+", p; // regresando al ambito acutal";
					

					this.c3d.addCodigo(l15);
					this.c3d.addCodigo(l16);
					this.c3d.addCodigo(l17);
					this.c3d.addCodigo("");
				}else{
					errores.insertarError("Semantico","La variable "+ nombreVar+", no existe");

				}

			}else{
				// se realizara una instancia de una vairable local
				console.log("INSATANCIA DE VAIRABLEA LOCAL");

				var posVariable = this.tablaSimbolos.obtenerPosLocal(nombreVar,ambitos);
				if(posVariable!= -1){
					var temp1= this.c3d.getTemporal();
					var l1 = "+, p, "+ posVariable+", "+ temp1+"; // pos de "+ nombreVar;
					var l2 = "<=, "+temp1+", h, stack; //guardando referencia del heap para el objeto "+ nombreVar;
					var temp2 = this.c3d.getTemporal();
					var l3 = "+, h, 1, "+temp2+"; // guardo la posicion donde inicia el objeto ";
					var l4 = "<=, h, "+temp2+", heap; // guardando donde es que inicia el objeto dentro del heap";
					var l5 = "+, h, 1, h; // sumando al heap la posicion que usamos extra para el doble apuntador ";
					var l6 = "+, h, "+sizeClase+", h; // reservando espacio para el objeto "+ nombreVar;
					var l7 = "//Ingresando referencia al this del objeto "+ nombreVar;
					var temp3 =this.c3d.getTemporal();
					var l8 = "+, p, "+posVariable+", "+temp3+"; // pos de "+nombreVar;
					var temp4 = this.c3d.getTemporal();
					var l9 = "=>, "+temp3+", "+temp4+", stack; // obteniendo apuntador de "+ nombreVar;
					var temp5 = this.c3d.getTemporal();
					var l10 = "+, p, "+ sizeFuncActual+", "+ temp5+"; // simulando cambio de ambito";
					var temp6 = this.c3d.getTemporal();
					var l11 = "+, "+temp5+", 0, "+temp6+"; //pos del this de "+nombreVar;
					var l12 = "<=, "+temp6+", "+temp4+", stack; // insertando apuntador del heap al stack del obeto "+ nombreVar;

					this.c3d.addCodigo("// ----------- Instancia a una variable local --------------");
					this.c3d.addCodigo(l1);
					this.c3d.addCodigo(l2);
					this.c3d.addCodigo(l3);
					this.c3d.addCodigo(l4);
					this.c3d.addCodigo(l5);
					this.c3d.addCodigo(l6);
					this.c3d.addCodigo(l7);
					this.c3d.addCodigo(l8);
					this.c3d.addCodigo(l9);
					this.c3d.addCodigo(l10);
					this.c3d.addCodigo(l11);
					this.c3d.addCodigo(l12);
				
					if(noParametros!= 0){
						this.c3d.addCodigo("// Asignando parametros  ");
						var expresionTemporal;
						var cont=1;
						for(var j =0; j< parametrosInstancia.length; j++){
							expresionTemporal = parametrosInstancia[j];
							var temp1_1 = this.c3d.getTemporal();
							var l1_1= "+, p, "+sizeFuncActual+", "+temp1_1+"; // size de funcion actual";
							var temp2_1= this.c3d.getTemporal();
							var l2_1= "+, "+temp1_1+", "+cont+", "+temp2_1+"; //pos del parametro "+ cont;
							cont++;
							var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
							var l3_1="";
							this.c3d.addCodigo(l1_1);
							this.c3d.addCodigo(l2_1);
							if(retExpresion.tipo.toUpperCase() != "NULO"){
								l3_1= "<=, "+temp2_1+", "+retExpresion.valor+", stack; // asignado al stack el parametro";
								this.c3d.addCodigo(l3_1);
							} 
							
						}

					}else{
						this.c3d.addCodigo("// No posee parametros ");
					}
					var l15= "+, p, "+sizeFuncActual+", p; // simulando cambio de ambito";
					var l16 = "call, , , "+firmMetodo+";";
					var l17 = "-, p, "+sizeFuncActual+", p; // regresando al ambito acutal";
					this.c3d.addCodigo(l15);
					this.c3d.addCodigo(l16);
					this.c3d.addCodigo(l17);
					this.c3d.addCodigo("");
				
				}else{
					errores.insertarError("Semantico","La variable "+ nombreVar+", no existe");
				}
				
			}//fin else de que la instancia es local

		}else{
			errores.insertarError("Semantico", "No existe "+nombreVar);
		}
	}else{

		console.log("La variable  "+ nombreVar+", es de tipo "+tipoVar+", imposible de instanciar con tipo "+ nombreClaseInstanciar);
		errores.insertarError("Semantico", "La variable  "+ nombreVar+", es de tipo "+tipoVar+", imposible de instanciar con tipo "+ nombreClaseInstanciar+", o El constructor no coincide con los parametros ");

	}






};

generacionCodigo.prototype.asignarPorSimboloIgual= function(nodoOperando, simbIgual, expresionVar, ambitos,clase, metodo){
//<=, "+retAcceso.referencia+", "+retExpresion.valor+", "+retAcceso.estructura+
	var retExpresion = this.resolverExpresion(expresionVar,ambitos,clase, metodo);
    if(retExpresion instanceof EleRetorno){
		if(retExpresion.tipo.toUpperCase() != "NULO"){
			if(simbIgual== "="){
				if(retExpresion.tipo.toUpperCase() == nodoOperando.tipo.toUpperCase()){
					var l2 = "<=, "+nodoOperando.referencia+", "+ retExpresion.valor+", "+nodoOperando.estructura+"; // asignando variable ";
					this.c3d.addCodigo(l2);
				}else{
					errores.insertarError("Semantico", "No coinciden tipos para poder hacer asignacion "+ nodoOperando.tipo+", "+ retExpresion.tipo);
				}
			}else{
				var temp1_3 = this.c3d.getTemporal();
				var l1_3= "=>, "+nodoOperando.referencia+", "+temp1_3+", "+nodoOperando.estructura+"; //obtenidoe el valor la vairable ";
				this.c3d.addCodigo(l1_3);
				var val1_1 = new EleRetorno();
				val1_1.valor = temp1_3;
				val1_1.tipo =nodoOperando.tipo.toUpperCase();
				val1_1.setReferencia(nodoOperando.estructura, nodoOperando.referencia);
				var ret;
				if(simbIgual=="+="){
					ret = this.validarSumaOperacion(val1_1, retExpresion);
				}
				if(simbIgual=="-="){
					ret = this.validarRestaOperacion(val1_1, retExpresion);
				}

				if(simbIgual=="*="){
					ret = this.validarMultiplicacionOperacion(val1_1, retExpresion);
				}

				if(simbIgual=="/="){
					ret = this.validarDivisionOperacion(val1_1, retExpresion);
				}

				if(ret.tipo.toUpperCase() == nodoOperando.tipo.toUpperCase() || ret.tipo.toUpperCase()== "NULO2"){
					var l2 = "<=, "+nodoOperando.referencia+", "+ ret.valor+", "+nodoOperando.estructura+"; // asignando vairble  ";
					this.c3d.addCodigo(l2);
				
				}else{
					errores.insertarError("Semantico", "Tipo "+ retExpresion.tipo+", no valido para asignar");
				}

			}

		}else{
			errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion");
		}

	}else{
		errores.insertarError("Semantico", "Ha ocurrido un error la intentar resolver para la expresion");
	}
};


generacionCodigo.prototype.operarRetorno = function (nodo, ambitos,clase, metodo){
	var expRetorno = nodo.expresionRetorno;
	var tipoFuncion = this.tablaSimbolos.obtenerTipoFuncion(metodo);
	if(tipoFuncion!=""){
		if(expRetorno!=null){
			var resultadoRetorno = this.resolverExpresion(expRetorno,ambitos,clase,metodo);
			if(resultadoRetorno instanceof EleRetorno){
				if(resultadoRetorno.tipo.toUpperCase() != "NULO"){
					if(resultadoRetorno.tipo.toUpperCase() == tipoFuncion.toUpperCase()){
						var posRetorno = this.tablaSimbolos.obtenerPosLocal("RETORNO",ambitos);
						if(posRetorno!=-1){
							var temp1 = this.c3d.getTemporal();
							var l1 = "+, P, "+posRetorno+", "+temp1+"; // pos de retorno de a funcion "+ metodo;
							var l2 = "<=, "+temp1+", "+resultadoRetorno.valor+", stack; //asignando el retorno con su valor";
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo("jmp, , , "+etiquetasRetorno.obtenerActual()+";");
						}else{
							errores.insertarError("Semantio", "No se ha encontrador retornor en "+ metodo);
						}
					}else{
						errores.insertarError("Semantico", "No coincide el tipo de la funcion "+ tipoFuncion+", con el retorno de tipo "+resultadoRetorno.tipo+", en la fucnion "+ metodo);
					}
				}else{
					errores.insertarError("Semantico", "Ha ocurrido un error al resolver a exprresion del retorno en "+ metodo);
				}
			}else{
				errorres.insertarError("Semantico", "Expresion no valida para evaluar un retorno en "+ metodo);
			}		
		}else{
			//salir del ambito actual
			this.c3d.addCodigo("jmp, , , "+etiquetasRetorno.obtenerActual()+";");
	
		}
	}else{
		errores.insertarError("Semantico", "No se ha encontrado la funcion con el nombre de "+ metodo);
	}
	
    
};

generacionCodigo.prototype.declararArreglo= function(tipoArreglo,nombreArreglo,dimensionesArreglo,ambitos,clase,metodo){
	var esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo,ambitos);
			
	if(esAtributo!= null){
		var simb= this.tablaSimbolos.obtenerSimbolo(nombreArreglo,ambitos,esAtributo);
		if(simb!=null){
			if(simb.tipoSimbolo.toUpperCase() == "ARREGLO"){
				if(esAtributo){
					//arreglo atributo
					var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreArreglo, ambitos);
					
					if(posArreglo != -1){
						var temp1 = this.c3d.getTemporal();
						var l1 = "+, P, 0, "+temp1+"; //pos this del arreglo";
						var temp2 = this.c3d.getTemporal();
						var l2 = "=>, "+temp1+", "+temp2+", stack; //obteniendo apuntador de arreglo en eel heap";
						var temp3 = this.c3d.getTemporal();
						var l3 = "=>, "+temp2+", "+temp3+", heap;//apuntando donde en verdad inicia el arreglo";
						var temp4 = this.c3d.getTemporal();
						var l4 = "+, "+temp3+", "+posArreglo+", "+ temp4+"; //pos del heap que guarda apuntador del heap para el arreglo "+ nombreArreglo;
						var l5 = "<=, "+temp4+", H, heap; //escribiendo apunt del heap donde inicia el arreglo ";
						var l6 = "// REsolvemos tamanio del arreglo";
						this.c3d.addCodigo("// ----------------------- Creando arreglo atributo "+ nombreArreglo);
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5);
						this.c3d.addCodigo(l6);
						var tamanios = this.calculoArregloNs(dimensionesArreglo,ambitos,clase,metodo);
						//calculando el valor linezliado del arreglo
						if(tamanios.length == dimensionesArreglo.length){
							this.tablaSimbolos.setArregloNs(nombreArreglo,ambitos,esAtributo,tamanios);
							var nTemporal;
							var tempRes="";
							for(var k =0; k<tamanios.length; k++ ){
								nTemporal = tamanios[k];
								if(k == 0){
									var temp1_1= this.c3d.getTemporal();
									var l1_1= "-, "+nTemporal+", 1, "+temp1_1+"; //calculando el n real";
									tempRes = this.c3d.getTemporal();
									var l2_1= "-, "+temp1_1+", 0, "+tempRes+"; //iReal columna "+k;
									this.c3d.addCodigo(l1_1);
									this.c3d.addCodigo(l2_1);	
								}else{
									var temp1_1= this.c3d.getTemporal();
									var l1_1= "-, "+nTemporal+", 1, "+temp1_1+"; //calculando el n real";
									var temp2_1= this.c3d.getTemporal();
									var l2_1= "*, "+tempRes+", "+nTemporal+", "+temp2_1+";// multiplicando por n"+k;
									var temp3_1= this.c3d.getTemporal();
									var l3_1="+, "+temp2_1+", "+temp1_1+", "+ temp3_1+";";
									this.c3d.addCodigo(l1_1);
									this.c3d.addCodigo(l2_1);
									this.c3d.addCodigo(l3_1);
									tempRes = this.c3d.getTemporal();
									var l4_1 = "-, "+temp3_1+", 0, "+tempRes+"; //i real de columna "+k;
									this.c3d.addCodigo(l4_1);
								}

							}

							if(tempRes != ""){
								var l1_0= "+, "+tempRes+", 1, "+tempRes+"; //size del arreglo "+nombreArreglo; // extraaaaaa
								var l1_2= "<=, H, "+tempRes+", heap; // insertando el tamanio del arreglo linealizado "+ nombreArreglo;
								var l2_2= "+, H, 1, H;";
								var temp1_2 = this.c3d.getTemporal();
								var l3_2= "+, "+tempRes+", 0, "+temp1_2+"; // anhadiendo una posicion mas"; ///aquiii par pos exra 1 o 0
								var l4_2 ="+, h, "+temp1_2+", h; // reservnado el espacio del arreglo "+nombreArreglo;
								this.c3d.addCodigo(l1_0); //extra
								this.c3d.addCodigo(l1_2);
								this.c3d.addCodigo(l2_2);
								this.c3d.addCodigo(l3_2);
								this.c3d.addCodigo(l4_2);
							}


						}
						
					}else{
						errorres.insertarError("Semantico", "No existe el arreglo "+ nombreArreglo+" pos -1");
					}
					

				}else{
					//arreglo local
					var posArreglo = this.tablaSimbolos.obtenerPosLocal(nombreArreglo,ambitos);
					if(posArreglo!= -1){
						var temp1 = this.c3d.getTemporal();
						var l1= "+, P, "+posArreglo+", "+temp1+"; //pos de arreglo "+nombreArreglo;
						var l2= "<=, "+temp1+", H, stack; // ingrensando al stack apunt del heap para "+nombreArreglo;
						var temp2 = this.c3d.getTemporal();
						var l3 = "+, H, 1, "+temp2+";";
						var l4 = "<=, H, "+temp2+", heap; //insetnado donde inicia el arreglo "+nombreArreglo;
						var l5 = "+, H, 1, H;";
						var l6 = "// calculando el tamanho del arreglo";
						this.c3d.addCodigo("// ------------------------ Creando arreglo local "+ nombreArreglo);
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5);
						this.c3d.addCodigo(l6);

						var tamanios = this.calculoArregloNs(dimensionesArreglo,ambitos,clase,metodo);
						console.log("****************************************************");
						console.dir(tamanios);
						//calculando el valor linezliado del arreglo
						if(tamanios.length == dimensionesArreglo.length){
							this.tablaSimbolos.setArregloNs(nombreArreglo,ambitos,esAtributo,tamanios);
							
							var nTemporal;
							var tempRes="";
							for(var k =0; k<tamanios.length; k++ ){
								nTemporal = tamanios[k];
								if(k == 0){
									var temp1_1= this.c3d.getTemporal();
									var l1_1= "-, "+nTemporal+", 1, "+temp1_1+"; //calculando el n real";
									tempRes = this.c3d.getTemporal();
									var l2_1= "-, "+temp1_1+", 0, "+tempRes+"; //iReal columna "+k;
									this.c3d.addCodigo(l1_1);
									this.c3d.addCodigo(l2_1);	
								}else{
									var temp1_1= this.c3d.getTemporal();
									var l1_1= "-, "+nTemporal+", 1, "+temp1_1+"; //calculando el n real";
									var temp2_1= this.c3d.getTemporal();
									var l2_1= "*, "+tempRes+", "+nTemporal+", "+temp2_1+";// multiplicando por n"+k;
									var temp3_1= this.c3d.getTemporal();
									var l3_1="+, "+temp2_1+", "+temp1_1+", "+ temp3_1+";";
									this.c3d.addCodigo(l1_1);
									this.c3d.addCodigo(l2_1);
									this.c3d.addCodigo(l3_1);
									tempRes = this.c3d.getTemporal();
									var l4_1 = "-, "+temp3_1+", 0, "+tempRes+"; //i real de columna "+k;
									this.c3d.addCodigo(l4_1);
								}
							}

							if(tempRes != ""){
								var l1_0= "+, "+tempRes+", 1, "+tempRes+"; //size del arreglo "+nombreArreglo; // extraaaaaa
								var l1_2= "<=, H, "+tempRes+", heap; // insertando el tamanio del arreglo linealizado "+ nombreArreglo;
								var l2_2= "+, H, 1, H;";
								//var temp1_2 = this.c3d.getTemporal();
								//var l3_2= "+, "+tempRes+", 1, "+temp1_2+"; // anhadiendo una posicion mas";
								var l4_2 ="+, h, "+tempRes+", h; // reservnado el espacio del arreglo "+nombreArreglo;
								this.c3d.addCodigo(l1_0); //extra
								this.c3d.addCodigo(l1_2);
								this.c3d.addCodigo(l2_2);
								//this.c3d.addCodigo(l3_2);
								this.c3d.addCodigo(l4_2);
								//simb= this.tablaSimbolos.obtenerSimbolo(nombreArreglo,ambitos,esAtributo);
								//console.dir(simb);


							}


						}

					}else{
						errores.insertarError("Semantico", "No existe el arrglo local "+ nombreArreglo+", pos "+posArreglo);
					}	
				}

			} else{
				errores.insertarError("Semantico", "No existe el arreglo "+nombreArreglo);

			}

		}else{
			errores.insertarError("Semantico", "No existe el arreglo "+nombreArreglo);
		}


	}else{
		errores.insertarError("Semantico", "No existe el arreglo "+nombreArreglo);
	}	
};
 

generacionCodigo.prototype.instanciarEstructura = function(nodo,ambitos,clase,metodo){

	var tipo_lista = nodo.tipoLista;
			var nombre_lista = nodo.nombreLista;
			var esAtributo = this.tablaSimbolos.esAtributo(nombre_lista, ambitos);
			if(esAtributo!=null){
				if(esAtributo){
					console.log("es atriuto "+ nombre_lista);
					var posLista = this.tablaSimbolos.obtenerPosAtributo(nombre_lista,ambitos);
					if(posLista!=-1){
						var temp1 = this.c3d.getTemporal();
						var temp2 = this.c3d.getTemporal();
						var temp3 = this.c3d.getTemporal();
						var temp5 = this.c3d.getTemporal();
						var l1= "+, P, 0, "+temp1+"; //pos this";
						var l2= "=>, "+temp1+", "+temp2+", stack; // obtenienido apuntador al heap para la lista";
						var l3= "=>, "+temp2+", "+temp3+", heap; //apauntador al heap para el objeto";
						var l5= "+, "+temp3+", "+posLista+", "+temp5+"; // pos donde inicia la lista";
						var l6= "<=, "+temp5+", H, heap;";
						var l7= "<=, H, -1, heap; // ingresando el size de la lista";
						var l8= "+, H, 1, H;";
						var l9= "<=, H, -1, heap; // ingresando el apuntador nulo a la lista";
						var l10= "+, H, 3, H;";
						this.c3d.addCodigo("// ------------------------ Instanciando una nueva lista atributo --------------------");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l5);
						this.c3d.addCodigo(l6);
						this.c3d.addCodigo(l7);
						this.c3d.addCodigo(l8);
						this.c3d.addCodigo(l9);
						this.c3d.addCodigo(l10);
					}else{
						errores.insertarError("Semantica", "No existe la lista "+ nombre_lista);
					}

				}else{
					//es una vairable local
					console.log("es local"+ nombre_lista);
					var posLista = this.tablaSimbolos.obtenerPosLocal(nombre_lista,ambitos);
					if(posLista!=-1){
						var temp1 = this.c3d.getTemporal();
						var temp2 = this.c3d.getTemporal();
						var l1= "+, P, "+posLista+", "+temp1+"; //pos de lista  "+nombre_lista;
						var l2= "<=, "+temp1+", H, stack; //escribiendo apuntador al heap";
						var l3= "+, H, 1, "+temp2+"; ";
						var l4= "<=, H, "+temp2+", heap;";
						var l5= "+, H, 1, H;";
						var l6= "<=, H, -1, heap; //ingresando el size de la lista";
						var l7= "+, H, 1, H;";
						var l8= "<=, H, -1, heap; //ingresando el apuntador a nulo";
						var l9= "+, H, 3, H;";
						this.c3d.addCodigo("// ------------------------ Instanciando una nueva lista atributo --------------------");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5);
						this.c3d.addCodigo(l6);
						this.c3d.addCodigo(l7);
						this.c3d.addCodigo(l8);
						this.c3d.addCodigo(l9);
					}else{
						errores.insertarError("Semantico", "La lista no existe "+nombre_lista);
					}

				}

			}else{
				errores.insertarError("Semantica", "No existe la lista "+ nombre_lista);
			}

};



generacionCodigo.prototype.obtenerApuntadorPosArreglo = function(nombreArreglo, posicionesArreglo, ambitos, clase, metodo, posFinal, modo){
	 //posFinal donde incia el objet  modo falso normal true acceso
		var ret2 = new EleRetorno();
		ret2.setValoresNulos();
		var esAtributo;
		var tipoArreglo= this.tablaSimbolos.obtenerTipo(nombreArreglo,ambitos);
		if(modo == true){
			//viene de una acceso la prioridad son los atributos no las variables locales
			esAtributo = this.tablaSimbolos.esAtributoAcceso(nombreArreglo, ambitos);
		}else{
			esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo, ambitos);
		}

		if(esAtributo!= null){
			var simb= this.tablaSimbolos.obtenerSimbolo(nombreArreglo,ambitos,esAtributo);
			if(simb!=null){
				if(simb.tipoSimbolo.toUpperCase() == "ARREGLO"){
					if(esAtributo){
						//arreglo atributo
						var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreArreglo, ambitos);
						if(posArreglo!=-1){
							this.c3d.addCodigo("//------------- Asignancio posicion de un arreglo Atributo  "+nombreArreglo);
							var temp4 = this.c3d.getTemporal();
							if(modo==true){
								var temp_ = this.c3d.getTemporal();
								this.c3d.addCodigo("=>, "+posFinal+", "+temp_+", heap; // obteniendo apuntador al heap del arreglo ");
								var l4 = "+, "+temp_+", "+posArreglo+", "+temp4+"; // pos del arreglo dentro del heap acceso ";
								this.c3d.addCodigo(l4);
							}else{
								var temp1 = this.c3d.getTemporal();
								var temp2 = this.c3d.getTemporal();
								var temp3 = this.c3d.getTemporal();
								var l1 = "+, P, 0, "+temp1+"; // pos this del objeto ";
								var l2 = "=>, "+temp1+", "+temp2+", stack; // apunt del heap para le objeto";
								var l3 = "=>, "+temp2+", "+temp3+", heap; // apunt donde inicia el objeto";
								var l4 = "+, "+temp3+", "+posArreglo+", "+temp4+"; // pos del arreglo dentro del heap ";
								this.c3d.addCodigo(l1);
								this.c3d.addCodigo(l2);
								this.c3d.addCodigo(l3);
								this.c3d.addCodigo(l4);

							}
							var temp5 = this.c3d.getTemporal();
							var temp6 = this.c3d.getTemporal();
							var temp7 = this.c3d.getTemporal();
							var l5 = "=>, "+temp4+", "+temp5+", heap; // apuntador donde inicia el arreglo";
							var l6 = "=>, "+temp5+", "+temp6+", heap; // size del arreglo "+ nombreArreglo;
							var l7 = "+, "+temp5+", 1, "+temp7+"; //pos 0 del arreglo "+ nombreArreglo;
							
							this.c3d.addCodigo(l5);
							this.c3d.addCodigo(l6);
							this.c3d.addCodigo(l7);
							var tamanios = this.calculoArregloNs(posicionesArreglo,ambitos,clase,metodo);
							var tamanios2 = simb.arregloNs;
							this.c3d.addCodigo("// ----------- Calculo de iReal para el arreglo "+ nombreArreglo);
							//if(tamanios.length == posicionesArreglo.length && (tamanios2.length == tamanios.length)){
								var nTemporal;
								var tempRes="";
								var nSize;
								for(var k =0; k<tamanios.length; k++ ){
									nTemporal = tamanios[k];
									nSize = tamanios2[k];

									if(k == 0){
										var temp1_1= this.c3d.getTemporal();
										var l1_1= "-, "+nTemporal+", 0, "+temp1_1+"; //calculando el n real ()";
										tempRes = this.c3d.getTemporal();
										var l2_1= "-, "+temp1_1+", 0, "+tempRes+"; //iReal columna "+k;
										this.c3d.addCodigo(l1_1);
										this.c3d.addCodigo(l2_1);	
									}else{
										var temp1_1= this.c3d.getTemporal();
										var l1_1= "-, "+nTemporal+", 0, "+temp1_1+"; //calculando el n real ()";
										var temp2_1= this.c3d.getTemporal();
										var l2_1= "*, "+tempRes+", "+nSize+", "+temp2_1+";// multiplicando por n"+k;
										var temp3_1= this.c3d.getTemporal();
										var l3_1="+, "+temp2_1+", "+temp1_1+", "+ temp3_1+";";
										this.c3d.addCodigo(l1_1);
										this.c3d.addCodigo(l2_1);
										this.c3d.addCodigo(l3_1);
										tempRes = this.c3d.getTemporal(); 
										var l4_1 = "-, "+temp3_1+", 0, "+tempRes+"; //i real de columna "+k;
										this.c3d.addCodigo(l4_1);
									}
								}// fin ciclo for donde se calcula la posicion

								if(tempRes!=""){
									var temp1_8 = this.c3d.getTemporal();
									var l1_8= "+, "+temp7+", "+tempRes+", "+temp1_8+"; // pos buscade del arreglo atributo "+ nombreArreglo;
									this.c3d.addCodigo(l1_8);
									var eler = new EleRetorno();
									eler.tipo = tipoArreglo;
									eler.valor = temp1_8;
									return eler;
								  }else{
									  errores.insertarError("Semantico", "Hubo un error al realizar las operaciones para la posicoina a asignar");
									  return ret2;
								  }

							//}//fin de la verificacion ue sena el mismo numero de columnas
						//else{
							//	errores.insertarError("Semantico", "No coiciden el numero de columnas ocn las que se definio "+nombreArreglo);
							//	return ret2;
						//	}
						}else{
							errores.insertarError("Semantico", "El arreglo "+ nombreArreglo+", no existe Atributo");
							return ret2;
						}
						
					}else{
						//arreglo local
						var posArreglo = this.tablaSimbolos.obtenerPosLocal(nombreArreglo,ambitos);
						if(posArreglo!=-1){
							var temp1 = this.c3d.getTemporal();
							var l1 = "+, P, "+posArreglo+", "+temp1+"; // pos de arreglo "+nombreArreglo;
							var temp2 = this.c3d.getTemporal();
							var l2 = "=>, "+temp1+", "+temp2+", stack; // apunt al heap de arreglo "+ nombreArreglo;
							var temp3 = this.c3d.getTemporal();
							var l3 = "=>, "+temp2+", "+temp3+", heap; //apunt al heap donde inicia el arreglo "+ nombreArreglo;
							var temp4 = this.c3d.getTemporal();
							var l4 = "=>, "+temp3+", "+temp4+", heap; //obteniendo el tamanio del arreglo "+ nombreArreglo;
							var temp5 = this.c3d.getTemporal();
							var l5 = "+, "+temp3+", 1, "+temp5+"; // pos 0 del arreglo "+ nombreArreglo;
							var l6 = "// ---- Calculo de valor de las posiciones  ";
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							this.c3d.addCodigo(l6);
							var tamanios = this.calculoArregloNs(posicionesArreglo,ambitos,clase,metodo);
							var tamanios2 = simb.arregloNs;
							this.c3d.addCodigo("// -----------(Obteniendo valor) Calculo de iReal para el arreglo "+ nombreArreglo);
						//	if(tamanios.length == posicionesArreglo.length && (tamanios2.length == tamanios.length)){
								var nTemporal;
								var tempRes="";
								var nSize;
								for(var k =0; k<tamanios.length; k++ ){
									nTemporal = tamanios[k];
									nSize = tamanios2[k];
									if(k == 0){
										var temp1_1= this.c3d.getTemporal();
										var l1_1= "-, "+nTemporal+", 0, "+temp1_1+"; //calculando el n real ()";
										tempRes = this.c3d.getTemporal();
										var l2_1= "-, "+temp1_1+", 0, "+tempRes+"; //iReal columna "+k;
										this.c3d.addCodigo(l1_1);
										this.c3d.addCodigo(l2_1);	
									}else{
										var temp1_1= this.c3d.getTemporal();
										var l1_1= "-, "+nTemporal+", 0, "+temp1_1+"; //calculando el n real ()";
										var temp2_1= this.c3d.getTemporal();
										var l2_1= "*, "+tempRes+", "+nSize+", "+temp2_1+";// multiplicando por n"+k;
										var temp3_1= this.c3d.getTemporal();
										var l3_1="+, "+temp2_1+", "+temp1_1+", "+ temp3_1+";";
										this.c3d.addCodigo(l1_1);
										this.c3d.addCodigo(l2_1);
										this.c3d.addCodigo(l3_1);
										tempRes = this.c3d.getTemporal(); 
										var l4_1 = "-, "+temp3_1+", 0, "+tempRes+"; //i real de columna "+k;
										this.c3d.addCodigo(l4_1);
									}

								}

								if(tempRes!=""){
									var temp1_5 = this.c3d.getTemporal();
									var l1_5= "+, "+temp5+", "+tempRes+", "+temp1_5+"; // pos buscada del arreglo  "+ nombreArreglo;
									this.c3d.addCodigo(l1_5);
									var ret = new EleRetorno();
									ret.tipo = tipoArreglo;
									ret.valor = temp1_5;
									return ret;
								  }else{
									  errores.insertarError("Semantico", "Hubo un error al realizar las operaciones para la posicoina a asignar");
									  return ret2;
								  }
							//}else{
							//	errores.insertarError("Semantico", "No coincide el numero de valores para resolver arreglo");
							//	return ret2;
							//}
						}else{
							errores.insertarError("Semantico", "El arreglo "+ nombreArreglo+", no existe");
							return ret2;
						}	
					}

				} else{
					errores.insertarError("Semantico", "No existe el arreglo "+nombreArreglo);
					return ret2;

				}
			}else{
				errores.insertarError("Semantico", "No existe el arreglo "+nombreArreglo);
			}

		}else{
			errores.insertarError("Semantico", "No existe el arreglo "+nombreArreglo);
			return ret2;
		}

		return ret2;
};


generacionCodigo.prototype.llamada_funcion= function(nodo, ambitos, clase, metodo, posFinal, modo){

	// true expresion, false acceso modo
	var nombreFunc = nodo.nombreFuncion;
	var parametrosFunc = nodo.parametros;
	var ret = new EleRetorno();
	ret.setValoresNulos();
	var sizeFuncActual = this.tablaSimbolos.sizeFuncion(clase,metodo);
	var firmaMetodo = this.tablaSimbolos.obtenerFirmaMetodo(clase,parametrosFunc.length,nombreFunc);
    var tipoFuncion = this.tablaSimbolos.obtenerTipoFuncion(firmaMetodo);	
	if((sizeFuncActual!= -1) && (firmaMetodo!="")){
		//var etiqSalida= this.c3d.getEtiqueta();
		///etiquetasRetorno.insertarEtiqueta(etiqSalida);
		if(modo){
			var temp1 = this.c3d.getTemporal();
			var temp2 = this.c3d.getTemporal();
			var temp3 = this.c3d.getTemporal();
			var temp4 = this.c3d.getTemporal();
			var l1 = "+, P, 0, "+temp1+";";
			var l2 = "=>, "+temp1+", "+temp2+", stack; ";
			var l3 = "+, P, "+sizeFuncActual+", "+temp3+";";
			var l4 = "+, "+temp2+", 0, "+temp4+";";
			var l5 = "<=, "+temp3+", "+temp2+", stack; ";
			this.c3d.addCodigo(l1);
			this.c3d.addCodigo(l2);
			this.c3d.addCodigo(l3);
			this.c3d.addCodigo(l4);
			this.c3d.addCodigo(l5);
		}else{
			var temp1_1= this.c3d.getTemporal();
			var temp1_2 = this.c3d.getTemporal();
			var l1_1="+, P, "+sizeFuncActual+", "+temp1_1+";";
			var l1_2="+, "+ temp1_1+", 0, "+temp1_2+";";
			var l1_3="<=, "+temp1_2+", "+posFinal+", stack; // pasadon como refeenria el valor del this";
			this.c3d.addCodigo(l1_1);
			this.c3d.addCodigo(l1_2);
			this.c3d.addCodigo(l1_3);
		}


		if(parametrosFunc.length>0){
			// posee parametros 
			var parametros = this.tablaSimbolos.obtenerParametros(clase+"_"+firmaMetodo);
			if(parametros!=0){
				var parametroTemporal;
				var nodoParametro;
				for(var i=0; i<parametros.length; i++){
					parametroTemporal = parametros[i];
					nodoParametro= parametroTemporal.expresionAtributo;
					if(nodoParametro instanceof t_id){

					}
					if(nodoParametro instanceof posicion_arreglo){


					}

				}
			}else{
				errores.insertarError("Semantico", "No existe la funcion "+ firmaMetodo+", con "+ parametrosFunc.length+" parametros");
				return;
			}
		}
		


		//van los parametros 
		var l6 = "+, P, "+sizeFuncActual+", P;";
		var l7 = "call, , , "+ firmaMetodo+";";
		var sizeFirma = this.tablaSimbolos.sizeFuncion(clase, firmaMetodo)-1;
		var temp5 = this.c3d.getTemporal();
		var temp6 = this.c3d.getTemporal();
		var l8 = "+, P, "+sizeFirma+", "+temp5+";";
		var l9 = "=>, "+temp5+", "+temp6+", stack; // valor del return";
		var l10 = "-, P, "+sizeFuncActual+", P;";
		this.c3d.addCodigo(l6);
		this.c3d.addCodigo(l7);
		//this.c3d.addCodigo(etiquetasRetorno.eliminarActual()+":");
		this.c3d.addCodigo(l8);
		this.c3d.addCodigo(l9);
		this.c3d.addCodigo(l10);
		
		var retornoFuncion = new EleRetorno();
		retornoFuncion.tipo= tipoFuncion;
		retornoFuncion.valor = temp6;
		retornoFuncion.setReferencia("STACK", temp5);
		return retornoFuncion;
	}else{
		errores.insertarError("Semantico", "La funcion "+ nombreFunc+", no existe");
		return ret;
	}

	return ret;
};


/* ================================================ Resolver Expresiones ===================================================== */


generacionCodigo.prototype.resolverEste = function(nodo,ambitos, clase, metodo){

	var elemenetoEste = nodo.elemento;
	var retorno = new EleRetorno();
	retorno.setValoresNulos();

	if(elemenetoEste instanceof t_id){
		var terminoId = elemenetoEste.nombreId;
		var esAtributo = this.tablaSimbolos.esAtributo(terminoId,ambitos);
		if(esAtributo!=null){
			if(esAtributo){
				var posVar = this.tablaSimbolos.obtenerPosAtributo(terminoId,ambitos);
				var tipoV = this.tablaSimbolos.obtenerTipo(terminoId,ambitos);
				if(posVar!=-1){
					var temp1 = this.c3d.getTemporal();
						var l1 = "+, p, 0, "+temp1+"; // pos this ";
						var temp2 = this.c3d.getTemporal();
						var l2 = "=>, "+temp1+", "+temp2+", stack; // obtenido apuntador al heap ";
						var temp3 = this.c3d.getTemporal();
						var l3 = "=>, "+temp2+", "+temp3+", heap; // apuntador ";
						var temp4 = this.c3d.getTemporal(); 
						var l4 = "+, "+temp3+", "+posVar+", "+temp4+"; // pos de "+ terminoId;
						var temp5 = this.c3d.getTemporal();
						var l5 = "=>, "+temp4+", "+temp5+", heap; // obtengo el valor que se encuentre en el heap ";
						this.c3d.addCodigo("// ------------ Resolviendo un ID (atributo) -----------");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5);
						var retExpresion = new EleRetorno();
						retExpresion.setValores(tipoV,temp5);
						retExpresion.setReferencia("HEAP",temp4);
						return retExpresion;
				}else{
					errores.insertarError("Semantico", "La vairable "+ terminoId+" no existe");
					return retorno;
				}

			}else{
				errores.insertarError("Semantico", "No se puede resolver la sentencia Este, debido a que "+ terminoId+", no es un atributo de "+clase);
				return retorno;
			}

		}else{
			errores.insertarError("Semantico", "La variable de nombre "+ terminoId+", no existe, fallo al resolver Este");
			return retorno;
		}


	}

	if(elemenetoEste instanceof llamada_funcion){
		var v = this.llamada_funcion(elemenetoEste,ambitos,clase,metodo, 0, true);
		return v;
	}

	if(elemenetoEste instanceof posicion_arreglo){
		var nombreArreglo = elemenetoEste.nombreArreglo;
		var posicionesArreglo = elemenetoEste.posicionesArreglo;
		var tipoArreglo= this.tablaSimbolos.obtenerTipo(nombreArreglo,ambitos);
		var esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo,ambitos);

		if(esAtributo!=null){
			if(esAtributo){
				var apuntadorArreglo = this.obtenerApuntadorPosArreglo(nombreArreglo,posicionesArreglo,ambitos,clase,metodo,0,false);
				if(apuntadorArreglo.tipo.toUpperCase() != "NULO"){
					var temp2_5 = this.c3d.getTemporal();
					var l2_5= "=>, "+apuntadorArreglo.valor+", "+temp2_5+", heap; //valor que trae el objeto";
					this.c3d.addCodigo(l2_5);
					var retornVal = new EleRetorno();
					retornVal.tipo = tipoArreglo;
					retornVal.valor = temp2_5;
					retornVal.setReferencia("HEAP",apuntadorArreglo.valor);
					return retornVal;
				}
			}else{
				errores.insertarError("Semantico", "El arreglo "+ nombreArreglo+", no es un atributo");
				return retorno;
			}

		}else{
			errores.insertarError("Semantico", "El arreglo "+nombreArreglo+", no existe");
			return retorno;

		}
	}

	if(elemenetoEste instanceof elementoAcceso){
		var nombreVar = elemenetoEste.objeto; //nodo id
		var nombreVariable= nombreVar.nombreId;
		var elementosAcceso = elemenetoEste .elementosAcceso;
		var esAtributo = this.tablaSimbolos.esAtributo(nombreVariable, ambitos);
		if(esAtributo!=null){
			if(esAtributo){
				var a = this.resolverAcceso(elemenetoEste, ambitos,clase, metodo);
				return a;
			}else{
				errores.insertarError("Semantico", "El atributo de tipo "+ nombreVariable+",debe de ser arreglo");
				return retorno;
			}
		}else{
			errores.insertarError("Semantico", "El atributo de tipo "+ nombreVariable+", no es valido");
			return retorno;
		}
}

return retorno;
};

generacionCodigo.prototype.crearCondicionBooleano = function(valBool){
	
	var etiqV = this.c3d.getEtiqueta();
	var etiqF = this.c3d.getEtiqueta();
	var codigoBool = "je, 1, "+valBool.valor+", "+etiqV+"; \n";
	codigoBool+="jmp, , , "+etiqF+";\n";
	var cond = new nodoCondicion(codigoBool);
	cond.addFalsa(etiqF);
	cond.addVerdadera(etiqV);
	return cond;
};

generacionCodigo.prototype.resolverExpresion = function(nodo, ambitos, clase, metodo) {
	//console.dir(nodo);

	var nombreSentecia = sentNombre.obtenerNombreExpresion(nodo).toUpperCase();
	
	switch(nombreSentecia){

		case "CONSULTAR_TAMANIO":{
			var nombreEd = nodo.expresion;
			var ret = EleRetorno();
			ret.setValoresNulos();

			var size = this.tablaSimbolos.obtenerSizeED(nombreEd);
			 if(size!=-1){
				 ret.setValorEntero(size);
				 return ret;
			 }else{
				 errores.insertarError("Semantico", "No existe la estructura de nombre "+nombreEd);
				 return ret;
			 }
			break;
		}

		case "NEGATIVO":{
			var expNegativo = nodo.expresion;
			var retExpUnario = this.resolverExpresion(expNegativo, ambitos, clase, metodo);
			var num = new numeroEntero();
			num.setNumero(-1);
			var retNum = this.resolverExpresion(num,ambitos,clase,metodo);
			if(retExpUnario.tipo.toUpperCase()!= "NULO"){
				var c= this.validarMultiplicacionOperacion(retExpUnario,retNum);
				return c;
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error al trtar de resolver un negativo ");
			}
			break;
		}

		case "UNARIO":{
			var expUnario = nodo.expresion;
			var simbUnario = nodo.operador;
			var retExpUnario = this.resolverExpresion(expUnario, ambitos, clase, metodo);
			var num = new numeroEntero();
			num.setNumero(1);
			var retUno= this.resolverExpresion(num,ambitos,clase,metodo);
			if(retExpUnario.tipo.toUpperCase()!= "NULO"){
				if(simbUnario == "++"){
					return this.validarSumaOperacion(retExpUnario,retUno);
				}else{
					return this.validarRestaOperacion(retExpUnario,retUno);
				}
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un erro la tratar de resolver la operacoin de un unario");
			}
			break;
		}

		case "ESTE":{

			var ret = this.resolverEste(nodo, ambitos, clase, metodo);
			return ret;
			break;
		}

		case "NULO2":{
			var ret = new EleRetorno();
			ret.setValorVacio();
			return ret;
			break;
		}
		
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
			
			var l0= "// Resolviendo una cadena ";
			var cadena = nodo.valorCadena;
			var c;
			var temp0= this.c3d.getTemporal();
			var l00= "+, H, 0, "+temp0+"; //apuntaodr a cadena ";
			var temp1 = this.c3d.getTemporal();
			var l1 = "+, H, 1, "+temp1+"; //apu donde inicia la cadena";
			var l2 = "<=, "+temp0+", "+ temp1+", heap; //guaradnod donde inicia la cadena ";
			var l3 = "+, H, 1, H;";
			var l4 = "<=, H, "+cadena.length+", heap; //guardando el tamanio de la cadena";
			var l5 = "+, H, 1, H;";
			var tempRef = this.c3d.getTemporal();
			var lRef = "+, H, 0, "+tempRef+"; // referencia de donde iniciar el primer caracter de la cadena";
			this.c3d.addCodigo(l0);
			this.c3d.addCodigo(l00);
			this.c3d.addCodigo(l1);
			this.c3d.addCodigo(l2);
			this.c3d.addCodigo(l3);
			this.c3d.addCodigo(l4);
			this.c3d.addCodigo(l5);
			this.c3d.addCodigo(lRef);
			var l6="";
			for(var i = 0; i< cadena.length; i++){
				c= cadena.charCodeAt(i);
				l6="<=, H, "+c+", heap; //guardadndo "+cadena.charAt(i);
				this.c3d.addCodigo(l6);
				this.c3d.addCodigo(l3);
			}
			var l7 = "<=, H, 34, heap; // ingresando caracter de escape de la cadena";
			this.c3d.addCodigo(l7);
			this.c3d.addCodigo(l3);
			var ret = new EleRetorno();
			ret.setValorCadena(temp0);
			ret.setReferencia("HEAP",tempRef);
			//console.dir(ret);
			return ret;

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
			var signo = "";
			switch(operando){

				case "==":{
					signo = "je";
					break;
				}
				case "!=":{
					signo = "jne";
					break;
				}
				case ">":{
					signo = "jg";
					break;
				}
				case ">=":{
					signo = "jge";
					break;

				}
				case "<":{
					signo = "jl";
					break;
				}
				case "<=":{
					signo = "jle";
					break;
				}
			}
			var retExp = this.validarRelacional(val1,val2,signo);
			if(retExp instanceof nodoCondicion){
				console.dir(retExp);
				return retExp;
			}else{
				errores.insertarError("Semantico", "Hubo un error al resolver la operacion relacional "+ signo);
				var r = new EleRetorno();
				r.setValoresNulos();
				return r;
			}
			break;
		}//fin relacional

		case "LOGICA":{

			var val1 = this.resolverExpresion(nodo.getExpresion1(),ambitos,clase,metodo);
			var val2 = this.resolverExpresion(nodo.getExpresion2(),ambitos,clase,metodo);
			var operando = nodo.getOperador();
			switch(operando){

				case "&&":{

					var nodo1;
					var nodo2;
					var tipo=0;
					if((val1 instanceof nodoCondicion) && (val2 instanceof nodoCondicion)){
						tipo=1;
						nodo1 = val1;
						nodo2 = val2;
					} else if((val1 instanceof nodoCondicion) && ( (val2 instanceof EleRetorno) && val2.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1 = val1;
						nodo2= this.crearCondicionBooleano(val2);
					} else if((val2 instanceof nodoCondicion) && ( (val1 instanceof EleRetorno) && val1.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1= this.crearCondicionBooleano(val1);
						nodo2= val2;

					}else  if(((val1 instanceof EleRetorno) && val1.tipo.toUpperCase() == "BOOLEANO") && 
					   ((val2 instanceof EleRetorno) && val2.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1 = this.crearCondicionBooleano(val1);
						nodo2 = this.crearCondicionBooleano(val2);
					}else{
						errores.insertarError("Semantico","Segundo operando de la operacion AND, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}

					if(tipo == 1){
						if(nodo1 instanceof nodoCondicion){
							if(nodo2 instanceof nodoCondicion){
								var codigoAnd = nodo1.getCodigo() + "\n" +
										nodo1.getEtiquetasVerdaderas() + "\n"+
										nodo2.getCodigo()+"\n";
								var resultadoAnd = new nodoCondicion(codigoAnd);
								resultadoAnd.addEtiquetasVerdaderas(nodo2.verdaderas);
								resultadoAnd.addEtiquetasFalsas(nodo1.falsas);
								resultadoAnd.addEtiquetasFalsas(nodo2.falsas);
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
					}else{
						errores.insertarError("Semantico","Segundo operando de la operacion AND, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}

					break;
				}

				case "||":{
					var nodo1;
					var nodo2;
					var tipo=0;
					if((val1 instanceof nodoCondicion) && (val2 instanceof nodoCondicion)){
						tipo=1;
						nodo1 = val1;
						nodo2 = val2;
					} else if((val1 instanceof nodoCondicion) && ( (val2 instanceof EleRetorno) && val2.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1 = val1;
						nodo2= this.crearCondicionBooleano(val2);
					} else if((val2 instanceof nodoCondicion) && ( (val1 instanceof EleRetorno) && val1.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1= this.crearCondicionBooleano(val1);
						nodo2= val2;

					}else  if(((val1 instanceof EleRetorno) && val1.tipo.toUpperCase() == "BOOLEANO") && 
					   ((val2 instanceof EleRetorno) && val2.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1 = this.crearCondicionBooleano(val1);
						nodo2 = this.crearCondicionBooleano(val2);
					}else{
						errores.insertarError("Semantico","Segundo operando de la operacion OR, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}

				if(tipo ==1){
					if(nodo1 instanceof nodoCondicion){
						if(nodo2 instanceof nodoCondicion){

							var codigoOr = nodo1.getCodigo()+ "\n" +
										   nodo1.getEtiquetasFalsas()+ "\n" +
										   nodo2.getCodigo()+ "\n" ;
							var resultadoOr = new nodoCondicion(codigoOr);
							resultadoOr.addEtiquetasVerdaderas(nodo1.verdaderas);
							resultadoOr.addEtiquetasVerdaderas(nodo2.verdaderas);
							resultadoOr.addEtiquetasFalsas(nodo2.falsas);
							return resultadoOr;

						}else{
							errores.insertarError("Semantico","Segundo operando de la operacion OR, no es valido");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Primero operando de la operacion OR, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;

					}
				}else{
					errores.insertarError("Semantico","Segundo operando de la operacion OR, no es valido");
					var ret = new EleRetorno();
					ret.setValoresNulos();
					return ret;
				}

					break;
				}

				case "??":{//xor

					var nodo1;
					var nodo2;
					var tipo=0;
					if((val1 instanceof nodoCondicion) && (val2 instanceof nodoCondicion)){
						tipo=1;
						nodo1 = val1;
						nodo2 = val2;
					} else if((val1 instanceof nodoCondicion) && ( (val2 instanceof EleRetorno) && val2.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1 = val1;
						nodo2= this.crearCondicionBooleano(val2);
					} else if((val2 instanceof nodoCondicion) && ( (val1 instanceof EleRetorno) && val1.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1= this.crearCondicionBooleano(val1);
						nodo2= val2;

					}else  if(((val1 instanceof EleRetorno) && val1.tipo.toUpperCase() == "BOOLEANO") && 
					   ((val2 instanceof EleRetorno) && val2.tipo.toUpperCase() == "BOOLEANO")){
						tipo = 1;
						nodo1 = this.crearCondicionBooleano(val1);
						nodo2 = this.crearCondicionBooleano(val2);
					}else{
						errores.insertarError("Semantico","Segundo operando de la operacion XOR, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}


				if(tipo==1){

					if(nodo1 instanceof nodoCondicion){
						if(nodo2 instanceof nodoCondicion){
							var codigoXor="";
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var etiqI = this.c3d.getEtiqueta();
							var etiq1= this.c3d.getEtiqueta();
							var etiq2 = this.c3d.getEtiqueta();
							
							var etiqV = this.c3d.getEtiqueta();
							var etiqF = this.c3d.getEtiqueta();


							//codigoXor+="jmp, , , "+etiqI+";";
							//codigoXor+=etiqI+":";
							codigoXor+= nodo1.getCodigo()+"\n";
							codigoXor+=nodo1.getEtiquetasVerdaderas()+"\n";
							codigoXor+="+, 1, 0, "+temp1+";\n";
							codigoXor+="jmp, , , "+etiq1+";\n";
							codigoXor+=nodo1.getEtiquetasFalsas()+"\n";
							codigoXor+="+, 0, 0, "+temp1+";\n";
							codigoXor+="jmp, , , "+etiq1+";\n";
							codigoXor+="jmp, , , "+etiq1+";\n";
							codigoXor+=etiq1+":\n";
							codigoXor+= nodo2.getCodigo()+"\n";
							codigoXor+=nodo2.getEtiquetasVerdaderas()+"\n";
							codigoXor+="+, 1, 0, "+temp2+";\n";
							codigoXor+="jmp, , , "+etiq2+";\n";
							codigoXor+=nodo2.getEtiquetasFalsas()+"\n";
							codigoXor+="+, 0, 0, "+temp2+";\n";
							codigoXor+="jmp, , , "+etiq2+";\n";
							codigoXor+="jmp, , , "+etiq2+";\n";
							codigoXor+=etiq2+":\n";
							codigoXor+="jne, "+temp1+", "+temp2+", "+etiqV+";";
							codigoXor+="jmp, , , "+etiqF+";";
							var resultadoXor = new nodoCondicion(codigoXor);
							resultadoXor.addFalsa(etiqF);
							resultadoXor.addVerdadera(etiqV);
							return resultadoXor;

						}else{
							errores.insertarError("Semantico","Segundo operando de la operacion XOR, no es valido");
							var ret = new EleRetorno();
							ret.setValoresNulos();
							return ret;
						}
					}else{
						errores.insertarError("Semantico","Primero operando de la operacion XOR, no es valido");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;

					}
				}else{
					errores.insertarError("Semantico","Segundo operando de la operacion XOR, no es valido");
					var ret = new EleRetorno();
					ret.setValoresNulos();
					return ret;
				}





					break;
				}

			}
			break;
		}//fin de operaciones logica

		case "NOT_LOGICA":{
			var val = this.resolverExpresion(nodo.getExpresion(),ambitos,clase,metodo);
			if(val instanceof nodoCondicion){
				val.cambiarEtiquetas();
				return val;
			}else if((val instanceof EleRetorno) && (val.tipo.toUpperCase() == "BOOLEANO")){
				var ret = this.crearCondicionBooleano(val);
				ret.cambiarEtiquetas();
				return ret;
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error al resolver NOT "+ val.tipo);
				var ret = new EleRetorno();
				ret.setValoresNulos();
				return ret;
			}
			break;
		}

		case "IDENTIFICADOR":{
			var nombreId = nodo.nombreId;
			var esAtributo = this.tablaSimbolos.esAtributo(nombreId, ambitos);
			if(esAtributo!=null){
				if(esAtributo){
					//accesar a un atributo
					var pos = this.tablaSimbolos.obtenerPosAtributo(nombreId,ambitos);
					var tipoV = this.tablaSimbolos.obtenerTipo(nombreId,ambitos);
					if(pos!=-1){
						var temp1 = this.c3d.getTemporal();
						var l1 = "+, p, 0, "+temp1+"; // pos this ";
						var temp2 = this.c3d.getTemporal();
						var l2 = "=>, "+temp1+", "+temp2+", stack; // obtenido apuntador al heap ";
						var temp3 = this.c3d.getTemporal();
						var l3 = "=>, "+temp2+", "+temp3+", heap; // apuntador ";
						var temp4 = this.c3d.getTemporal(); 
						var l4 = "+, "+temp3+", "+pos+", "+temp4+"; // pos de "+ nombreId;
						var temp5 = this.c3d.getTemporal();
						var l5 = "=>, "+temp4+", "+temp5+", heap; // obtengo el valor que se encuentre en el heap ";
						this.c3d.addCodigo("// ------------ Resolviendo un ID (atributo) -----------");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5);
						var retExpresion = new EleRetorno();
						retExpresion.setValores(tipoV,temp5);
						retExpresion.setReferencia("HEAP", temp4);
						return retExpresion;
					}else{
						errores.insertarError("Semantico", "La variable "+ nombreId +", no existe");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}					
				}else{
					//accesar a  una vairable local
					var pos = this.tablaSimbolos.obtenerPosLocal(nombreId,ambitos);
					var tipoV = this.tablaSimbolos.obtenerTipo(nombreId,ambitos);
					if(pos!=-1){
						var temp1 = this.c3d.getTemporal();
						var l1 = "+, p, "+pos+", "+temp1+"; // pos de "+nombreId;
						var temp2 = this.c3d.getTemporal();
						var l2 = "=>, "+temp1+", "+temp2+", stack; // valor de lo que trae en el stack "+ nombreId;
						this.c3d.addCodigo("// -------------- Resolviendo para un ID (var local) ------------");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						var retExpresion = new EleRetorno();
						retExpresion.setValores(tipoV,temp2);
						retExpresion.setReferencia("STACK", temp1);
						return retExpresion;

					}else{
						errores.insertarError("Semantico", "La variable "+ nombreId +", no existe");
						var ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;

					}

				}

			}else{
				errores.insertarError("Semantico", "La variable "+ nombreId +", no existe");
				var ret = new EleRetorno();
				ret.setValoresNulos();
				return ret;
			}


			break;
		}//fin identificador

		case "POS_ARREGLO":{
			var nombreArreglo = nodo.nombreArreglo;
			var posicionesArreglo = nodo.posicionesArreglo;
			var tipoArreglo= this.tablaSimbolos.obtenerTipo(nombreArreglo,ambitos);
			var apuntadorArreglo = this.obtenerApuntadorPosArreglo(nombreArreglo,posicionesArreglo,ambitos,clase,metodo,0,false);
			if(apuntadorArreglo.tipo.toUpperCase() != "NULO"){
				var temp2_5 = this.c3d.getTemporal();
				var l2_5= "=>, "+apuntadorArreglo.valor+", "+temp2_5+", heap; //valor que trae el objeto";
				this.c3d.addCodigo(l2_5);
				var retornVal = new EleRetorno();
				retornVal.tipo = tipoArreglo;
				retornVal.valor = temp2_5;
				retornVal.setReferencia("HEAP",apuntadorArreglo.valor);
				return retornVal;
			}
				var ret2 = new EleRetorno();
				ret2.setValoresNulos();
				return ret2;
				break;
			
		}//fin pos_arreglo

		case "OBTENERDIRECCION":{
			var a = this.obtenerDireccion(nodo, ambitos, clase, metodo);
			return a;
			break;
		}

		case "ACCESO":{
			var v = this.resolverAcceso(nodo,ambitos,clase,metodo);
			return v;
			break;
		}

		case "LLAMADA":{
			var v = this.llamada_funcion(nodo, ambitos,clase,metodo, 0, true);
			return v;
			break;
		}


	}//fin switch
	 
	
};




 generacionCodigo.prototype.vaciarArreglo = function(nombreArreglo, ambitos,clase,metodo){
 var esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo,ambitos);
				if(esAtributo!=null){
					var tempSize=this.c3d.getTemporal();
					var tempPos0 = this.c3d.getTemporal();
					if(esAtributo){
						var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreArreglo,ambitos);
						if(posArreglo!=1){
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var temp3= this.c3d.getTemporal();
							var temp4= this.c3d.getTemporal();
							var temp5= this.c3d.getTemporal();
							var l1= "+, P, 0, "+temp1+"; // pos this del objeto ";
							var l2= "=>, "+temp1+", "+temp2+", stack; // apuntador al heap del objeto ";
							var l3= "=>, "+temp2+", "+temp3+", heap; // apunt al heap donde inica el objeto";
							var l4 = "+, "+temp3+", "+posArreglo+", "+temp4+"; //apuntador a posicion donde incia el arreglo";
							var l5 = "=>, "+temp4+", "+temp5+", heap; // inicia el arreglo";
							var l6 = "=>, "+temp5+", "+tempSize+", heap; // size del arreglo "+ nombreArreglo;
							var l7 = "+, "+temp5+", 1, "+tempPos0+"; //Pos 0 del arreglo";
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							this.c3d.addCodigo(l6);
							this.c3d.addCodigo(l7);	
						}
					}else{
						//es un arreglo local
						var posArreglo = this.tablaSimbolos.obtenerPosLocal(nombreArreglo,ambitos);
						if(posArreglo!=-1){
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var temp3= this.c3d.getTemporal();

							var l1 = "+, P, "+posArreglo+", "+temp1+"; // pos del arreglo ";
							var l2 = "=>, "+temp1+", "+temp2+", stack; //apuntador al heap del arreglo";
							var l3 = "=>, "+temp2+", "+temp3+", heap; // apuntador del heap al heap donde inicia la cadena";
							var l4 = "=>, "+temp3+", "+tempSize+", heap; // size del arreglo "+ nombreArreglo;
							var l5 = "+, "+temp3+", 1, "+tempPos0+"; // pos 0 donde inicia el arreglo "+nombreArreglo;
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							
						}
					}

					//var retExp = this.resolverExpresion(expresionArreglo,ambitos,clase,metodo);
					if(cadena.tipo.toUpperCase()== "CADENA"){
						var tempApuntCadena= cadena.valor;
						var temp1= this.c3d.getTemporal();
						var tempSizeCadena = this.c3d.getTemporal();
						var tempPos0Cadena= this.c3d.getTemporal();
						var tempoCaracterCadena = this.c3d.getTemporal();
						var l1_1= "=>, "+tempApuntCadena+", "+temp1+", heap; // pos que apunta al size de la cadena";
						var l1_2= "=>, "+temp1+", "+tempSizeCadena+", heap; // size de la cadena";
						var l1_3= "+, "+temp1+", 1, "+tempPos0Cadena+"; // Pos 0 de la cadena";
						var l1_4= "=>, "+tempPos0Cadena+", "+tempoCaracterCadena+", heap; // sacandor el caracter del heap cadena";
						this.c3d.addCodigo(l1_1);
						this.c3d.addCodigo(l1_2);
						this.c3d.addCodigo(l1_3);
						this.c3d.addCodigo(l1_4);

						var etiq1V= this.c3d.getEtiqueta();
						var etiq1F= this.c3d.getEtiqueta();
						var etiq2V= this.c3d.getEtiqueta();
						var etiq2F = this.c3d.getEtiqueta();
						
						var l1_5="jle, "+tempSizeCadena+", "+tempSize+", "+etiq1V+";";
						var l1_6= "jmp, , , "+ etiq1F+";";
						var l1_18= "jmp, , , "+ etiq1V+";";
						var l1_7= etiq1V+":";
						var l1_8="jne, "+tempoCaracterCadena+", 34, "+etiq2V+";";
						var l1_9="jmp, , , "+etiq2F+";";
						var l1_19= "jmp, , , "+ etiq2V+";";
						var l1_10=etiq2V+":";
						var l1_11="<=, "+tempPos0+", "+tempoCaracterCadena+", heap; // guardando el caracter ";
						var l1_12="+, "+tempPos0+", 1, "+tempPos0+"; // incremnetnado la pos del arreglo";
						var l1_13="+, "+tempPos0Cadena+", 1, "+tempPos0Cadena+"; // incrementando la pos de la cadena";
						var l1_14= "=>, "+tempPos0Cadena+", "+tempoCaracterCadena+", heap; // sacandor el caracter del heap cadena";
						var l1_15= "jmp, , , "+ etiq1V+";";
						var l1_20= "jmp, , , "+ etiq2F+";";
						var l1_16=etiq2F+":";
						var l1_21= "jmp, , , "+ etiq1F+";";
						var l1_17 = etiq1F+":";
						this.c3d.addCodigo(l1_5);
						this.c3d.addCodigo(l1_6);
						this.c3d.addCodigo(l1_18);
						this.c3d.addCodigo(l1_7);
						this.c3d.addCodigo(l1_8);
						this.c3d.addCodigo(l1_9);
						this.c3d.addCodigo(l1_19);
						this.c3d.addCodigo(l1_10);
						this.c3d.addCodigo(l1_11);
						this.c3d.addCodigo(l1_12);
						this.c3d.addCodigo(l1_13);
						this.c3d.addCodigo(l1_14);
						this.c3d.addCodigo(l1_15);
						this.c3d.addCodigo(l1_20);
						this.c3d.addCodigo(l1_16);
						this.c3d.addCodigo(l1_21);
						this.c3d.addCodigo(l1_17);
						
					
					}	
				}

};



generacionCodigo.prototype.asignarCadenaArreglo= function(nombreArreglo, cadena, ambitos, clase, metodo){

	var esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo,ambitos);
				if(esAtributo!=null){
					var tempSize=this.c3d.getTemporal();
					var tempPos0 = this.c3d.getTemporal();
					if(esAtributo){
						var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreArreglo,ambitos);
						if(posArreglo!=1){
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var temp3= this.c3d.getTemporal();
							var temp4= this.c3d.getTemporal();
							var temp5= this.c3d.getTemporal();
							var l1= "+, P, 0, "+temp1+"; // pos this del objeto ";
							var l2= "=>, "+temp1+", "+temp2+", stack; // apuntador al heap del objeto ";
							var l3= "=>, "+temp2+", "+temp3+", heap; // apunt al heap donde inica el objeto";
							var l4 = "+, "+temp3+", "+posArreglo+", "+temp4+"; //apuntador a posicion donde incia el arreglo";
							var l5 = "=>, "+temp4+", "+temp5+", heap; // inicia el arreglo";
							var l6 = "=>, "+temp5+", "+tempSize+", heap; // size del arreglo "+ nombreArreglo;
							var l7 = "+, "+temp5+", 1, "+tempPos0+"; //Pos 0 del arreglo";
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							this.c3d.addCodigo(l6);
							this.c3d.addCodigo(l7);	
						}
					}else{
						//es un arreglo local
						var posArreglo = this.tablaSimbolos.obtenerPosLocal(nombreArreglo,ambitos);
						if(posArreglo!=-1){
							var temp1= this.c3d.getTemporal();
							var temp2= this.c3d.getTemporal();
							var temp3= this.c3d.getTemporal();

							var l1 = "+, P, "+posArreglo+", "+temp1+"; // pos del arreglo ";
							var l2 = "=>, "+temp1+", "+temp2+", stack; //apuntador al heap del arreglo";
							var l3 = "=>, "+temp2+", "+temp3+", heap; // apuntador del heap al heap donde inicia la cadena";
							var l4 = "=>, "+temp3+", "+tempSize+", heap; // size del arreglo "+ nombreArreglo;
							var l5 = "+, "+temp3+", 1, "+tempPos0+"; // pos 0 donde inicia el arreglo "+nombreArreglo;
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							
						}
					}

					//var retExp = this.resolverExpresion(expresionArreglo,ambitos,clase,metodo);
					if(cadena.tipo.toUpperCase()== "CADENA"){
						var tempApuntCadena= cadena.valor;
						var temp1= this.c3d.getTemporal();
						var tempSizeCadena = this.c3d.getTemporal();
						var tempPos0Cadena= this.c3d.getTemporal();
						var tempoCaracterCadena = this.c3d.getTemporal();
						var l1_1= "=>, "+tempApuntCadena+", "+temp1+", heap; // pos que apunta al size de la cadena";
						var l1_2= "=>, "+temp1+", "+tempSizeCadena+", heap; // size de la cadena";
						var l1_3= "+, "+temp1+", 1, "+tempPos0Cadena+"; // Pos 0 de la cadena";
						var l1_4= "=>, "+tempPos0Cadena+", "+tempoCaracterCadena+", heap; // sacandor el caracter del heap cadena";
						this.c3d.addCodigo(l1_1);
						this.c3d.addCodigo(l1_2);
						this.c3d.addCodigo(l1_3);
						this.c3d.addCodigo(l1_4);

						var etiq1V= this.c3d.getEtiqueta();
						var etiq1F= this.c3d.getEtiqueta();
						var etiq2V= this.c3d.getEtiqueta();
						var etiq2F = this.c3d.getEtiqueta();
						
						var l1_5="jle, "+tempSizeCadena+", "+tempSize+", "+etiq1V+";";
						var l1_6= "jmp, , , "+ etiq1F+";";
						var l1_18= "jmp, , , "+ etiq1V+";";
						var l1_7= etiq1V+":";
						var l1_8="jne, "+tempoCaracterCadena+", 34, "+etiq2V+";";
						var l1_9="jmp, , , "+etiq2F+";";
						var l1_19= "jmp, , , "+ etiq2V+";";
						var l1_10=etiq2V+":";
						var l1_11="<=, "+tempPos0+", "+tempoCaracterCadena+", heap; // guardando el caracter ";
						var l1_12="+, "+tempPos0+", 1, "+tempPos0+"; // incremnetnado la pos del arreglo";
						var l1_13="+, "+tempPos0Cadena+", 1, "+tempPos0Cadena+"; // incrementando la pos de la cadena";
						var l1_14= "=>, "+tempPos0Cadena+", "+tempoCaracterCadena+", heap; // sacandor el caracter del heap cadena";
						var l1_15= "jmp, , , "+ etiq1V+";";
						var l1_20= "jmp, , , "+ etiq2F+";";
						var l1_16=etiq2F+":";
						var l1_21= "jmp, , , "+ etiq1F+";";
						var l1_17 = etiq1F+":";
						this.c3d.addCodigo(l1_5);
						this.c3d.addCodigo(l1_6);
						this.c3d.addCodigo(l1_18);
						this.c3d.addCodigo(l1_7);
						this.c3d.addCodigo(l1_8);
						this.c3d.addCodigo(l1_9);
						this.c3d.addCodigo(l1_19);
						this.c3d.addCodigo(l1_10);
						this.c3d.addCodigo(l1_11);
						this.c3d.addCodigo(l1_12);
						this.c3d.addCodigo(l1_13);
						this.c3d.addCodigo(l1_14);
						this.c3d.addCodigo(l1_15);
						this.c3d.addCodigo(l1_20);
						this.c3d.addCodigo(l1_16);
						this.c3d.addCodigo(l1_21);
						this.c3d.addCodigo(l1_17);
						
					
					}	
				}

};

generacionCodigo.prototype.convertirArregloCadena = function(nombreVar, ambitos, clase, metodo){

	var esAtributo = this.tablaSimbolos.esAtributo(nombreVar, ambitos);
	var ret = new EleRetorno();
	ret.setValoresNulos();
	if(esAtributo!= null){
		var simboloVar = this.tablaSimbolos.obtenerSimbolo(nombreVar,ambitos,esAtributo);
		if(simboloVar.tipoSimbolo.toUpperCase() == "ARREGLO"){
			if(simboloVar.tipoElemento.toUpperCase() == "CARACTER"){
				//1. convertir a cadena el contendio del primer arreglo
				var inicioArreglo = "";
				var posSize="";
				var valSize="";

				if(esAtributo){
					// el arreglo a acceder es un atributo
					var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreVar,ambitos);

					if(posArreglo!=-1){
						var temp1 = this.c3d.getTemporal();
						var temp2 = this.c3d.getTemporal();
						var temp3 = this.c3d.getTemporal();
						var temp4 = this.c3d.getTemporal();
						posSize = this.c3d.getTemporal();
						valSize= this.c3d.getTemporal();
						inicioArreglo = this.c3d.getTemporal();
						var l1 = "+, P, 0, "+temp1+";";
						var l2 = "=>, "+temp1+", "+temp2+", stack; ";
						var l3 = "=>, "+temp2+", "+temp3+", heap; ";
						var l4 = "+, "+temp3+", "+posArreglo+", "+temp4+";";
						var l5 = "=>, "+temp4+", "+posSize+", heap; ";
						var l6 = "=>, "+posSize+", "+valSize+", heap; ";
						var l7 = "+, "+posSize+", 1, "+inicioArreglo+"; ";
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5);
						this.c3d.addCodigo(l6);
						this.c3d.addCodigo(l7);
					}else{
						errores.insertarError("Semnatico", "No existe el arreglo "+ nombreVar+", error en conversion a cadena");
						return ret;
					}

				}else{
					//el arreglo a acceder es una vairble local
					var posArreglo = this.tablaSimbolos.obtenerPosLocal(nombreVar,ambitos);
					if(posArreglo!=-1){
						var temp1 = this.c3d.getTemporal();
						var temp2 = this.c3d.getTemporal();
						posSize = this.c3d.getTemporal();
						valSize = this.c3d.getTemporal();
						inicioArreglo = this.c3d.getTemporal();

						var l1 = "+, P, "+posArreglo+", "+temp1+";";
						var l2 = "=>, "+temp1+", "+temp2+", stack; ";
						var l3 = "=>, "+temp2+", "+posSize+", heap; ";
						var l4 = "=>, "+posSize+", "+valSize+", heap; // valor de size del arreglo "+nombreVar;
						var l5 = "+, "+posSize+", 1, "+inicioArreglo+"; // apuntador donde inicia el arreglo "+nombreVar;
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);
						this.c3d.addCodigo(l5); 

					}else{
						errores.insertarError("Semnatico", "No existe el arreglo "+ nombreVar+", error en conversion");
						return ret;
					}

				}

				if(inicioArreglo!= ""){
					
					var valorCaracter = this.c3d.getTemporal(); // caacter actual del arreglo;
					var temp1 = this.c3d.getTemporal(); //apuntador inicial
					var temp2 = this.c3d.getTemporal(); // posSize
					var contCaracteres = this.c3d.getTemporal();
					var etiqCiclo = this.c3d.getEtiqueta();
					var etiqV = this.c3d.getEtiqueta();
					var etiqF = this.c3d.getEtiqueta();
					var l0 = "=>, "+inicioArreglo+", "+valorCaracter+", heap; // primer caracter del arreglo "+ nombreVar ;
					var l1 = "+, H, 0, "+temp1+";";
					var l2 = "+, H, 1, "+temp2+";";
					var l3 = "<=, "+temp1+", "+temp2+", heap; ";
					var l4 = "+, H, 1, H;";
					var l4_1= "+, 0, 0, "+contCaracteres+";";
					var l5 = "<=, H, "+contCaracteres +", heap; //asignanando temporalemnte size 0 de la cadena";
					var l6 = "+, H, 1, H;";

					var l7 = etiqCiclo+":";
					var l8 = "jne, "+valorCaracter+", 36, "+etiqV+";";
					var l9 = "jmp, , , "+etiqF+";";
					var l10 = etiqV+":";
					
					var l11 = "<=, H, "+valorCaracter+", heap; // ingresando el caracter "
					var l12 = "+, H, 1, H;";
					var l13 = "+, "+contCaracteres+", 1, "+contCaracteres+"; // incrementando en uno el size de la nueva cadena";
					var l14 = "+, "+inicioArreglo+", 1, "+inicioArreglo+";";
					var l15 = "=>, "+inicioArreglo+", "+valorCaracter+", heap; // obteniendio el nuevo caractere del arreglo";
					var l16 = "jmp, , , "+etiqCiclo+";"

					var l17 = etiqF+":";
					var l18 = "<=, "+temp2+", "+contCaracteres+", heap; // ingresando el size de la nueva cadena ";
					var l19 = "<=, H, 34, heap; // ingresando el caracter de escape de la nueva cadena";
					var l20 = "+, H, 1, H;";
					this.c3d.addCodigo(l0);
					this.c3d.addCodigo(l1);
					this.c3d.addCodigo(l2);
					this.c3d.addCodigo(l3);
					this.c3d.addCodigo(l4);
					this.c3d.addCodigo(l4_1);
					this.c3d.addCodigo(l5);
					this.c3d.addCodigo(l6);
					this.c3d.addCodigo(l7);
					this.c3d.addCodigo(l8);
					this.c3d.addCodigo(l9);
					this.c3d.addCodigo(l10);
					this.c3d.addCodigo(l11);
					this.c3d.addCodigo(l12);
					this.c3d.addCodigo(l13);
					this.c3d.addCodigo(l14);
					this.c3d.addCodigo(l15);
					this.c3d.addCodigo(l16);
					this.c3d.addCodigo(l17);
					this.c3d.addCodigo(l18);
					this.c3d.addCodigo(l19);
					this.c3d.addCodigo(l20);
					var retCadena = new EleRetorno();
					retCadena.setValorCadena(temp1);
					return retCadena;

				}else{
					errores.insertarError("Semantico", "No es valido convertir a cadena  "+ nombreVar);
					return ret;
				}

			}else{
				errores.insertarError("Semantico", "Para poder convertir a cadena, debe de ser de tipo caracter, error con "+ nombreVar);
				return ret;
			}
		}else{
			errores.insertarError("Semantico", "No se puede realizar la conversion a cadena , con la vairable "+nombreVar+", debe ser un arreglo y es "+ simboloVar.tipoSimbolo);
			return ret;
		}
	}else{
		errores.insertarError("Semantico", "La variable de nombre "+nombreVar+", no existe, no se puede realizar la conversion a cadena");
		return ret;
	}

	return ret;

}

generacionCodigo.prototype.funcionConcatenar = function(nodo, ambitos, clase, metodo){

	var nombreVar =nodo.nombreVariable;
	var exp1=nodo.expresion1;
	var exp2=nodo.expresion2;
	var tipoConcat=nodo.tipo;
	var cadenaArreglo = this.convertirArregloCadena(nombreVar,ambitos,clase,metodo);
	if(cadenaArreglo instanceof EleRetorno){
		if(cadenaArreglo.tipo.toUpperCase() == "CADENA"){
			if(tipoConcat == 2){
				//|concatenar abrePar id coma EXPRESION cierraPar puntoComa //2
				if(exp1 != null){
					if(exp1 instanceof term_cadena){
						var resCadena = this.resolverExpresion(exp1,ambitos,clase,metodo);
						if(resCadena instanceof EleRetorno){
							var cadenaRes = this.concatenarCadenas(cadenaArreglo, resCadena);
							if(cadenaRes.tipo.toUpperCase() == "CADENA"){
								// aquiii es donde se asigna al arrelo la cadena
								this.asignarCadenaArreglo(nombreVar,cadenaRes,ambitos,clase,metodo);
							}else{
								errores.insertarError("Semantico", "Ha ocurrido un error al resolver el segundo parametro de concatenar");
							}
						}else{
							errores.insertarError("Semantico", "Ha ocurrido un error al resolver el segundo parametro de concatenar");
						}
					}else if(exp1 instanceof t_id){
						var nombre = exp1.nombreId;
						var cadExp1 = this.convertirArregloCadena(nombre,ambitos,clase,metodo);
						if(cadExp1 instanceof EleRetorno){
							if(cadExp1.tipo.toUpperCase() == "CADENA"){
								var cadenaRes = this.concatenarCadenas(cadenaArreglo, cadExp1);
								if(cadenaRes.tipo.toUpperCase() == "CADENA"){
									// aquiii es donde se asigna al arrelo la cadena
									this.asignarCadenaArreglo(nombreVar,cadenaRes,ambitos,clase,metodo);
								}else{
									errores.insertarError("Semantico", "Ha ocurrido un error al resolver el segundo parametro de concatenar");
								}
							}else{
								errores.insertarError("Semantico", "Ha ocurrido un error al resolver el segundo parametro de concatenar");
							}
						}else{
							errores.insertarError("Semantico", "Ha ocurrido un error al resolver el segundo parametro de concatenar");
						}
					}else{
						errores.insertarError("Sematncio", "Operando dos de la operacion concatenacion, no es valido");
					}
				}else{
					errores.insertarError("Sematncio", "Operando dos de la operacion concatenacion, no es valido");
				}
			}

			if(tipoConcat == 1){
				//concatenar abrePar id coma EXPRESION coma EXPRESION cierraPar puntoComa 

				if(exp1 != null){
					if(exp2 != null){
						if(exp1 instanceof term_cadena){
							var cadenaExp1 = exp1.valorCadena;
							var resExp2 = this.resolverExpresion(exp2,ambitos,clase,metodo);
							if(resExp2 instanceof EleRetorno){
								var comodin="";
								var bandera = false;
								if (resExp2.tipo.toUpperCase() == "ENTERO"){
									comodin = "#E";
									bandera= true;
								}else if(resExp2.tipo.toUpperCase() == "DECIMAL"){
									comodin = "#D";
									bandera= true;
								}else if(resExp2.tipo.toUpperCase() == "BOOLENAO"){
									comodin = "#B";
									bandera= true;
								}else{
									errores.insertarError("Semantico", "El tipo del tercer parametros debe de ser entero, decimal o booleano, no de tipo "+ resExp2.tipo);
								}

								if(bandera == true){
									var arreglo = cadenaExp1.split(comodin);
									if(arreglo.length>1){
										var cadenaElemento = this.convertirCadena(resExp2);
										var primerElemento = new term_cadena();
										primerElemento.setCadena(arreglo[0]);
										var resPrimerElementoArreglo = this.resolverExpresion(primerElemento,ambitos,clase,metodo);
										var cadenaAcumulacion = this.concatenarCadenas(resPrimerElementoArreglo, cadenaElemento);
										var cadenaTemporal;
										for(var i=1; i<arreglo.length; i++){
											primerElemento = new term_cadena();
											primerElemento.setCadena(arreglo[i]);
											resPrimerElementoArreglo = this.resolverExpresion(primerElemento,ambitos,clase,metodo);
											var cadena2 = this.concatenarCadenas(resPrimerElementoArreglo, cadenaElemento);
											cadenaAcumulacion = this.concatenarCadenas(cadenaAcumulacion,cadena2);
										}

										this.asignarCadenaArreglo(nombreVar,cadenaAcumulacion,ambitos,clase,metodo);
									}else{

									}


								}else{

								}

							}else{

							}
							


						}else{
							errores.insertarError("Semantico", "El segundo parametro de la funcion concatenar, debe de ser una cadena");
						}

					}else{
						errores.insertarError("Semantico", "Error en parametro dos de la funcion concatenar");
					}
				}else{
					errores.insertarError("Semantico", "Error en parametro tres de la funcion concatenar");
				}

			}

		}else{
			errores.insertarError("Sematncio", "No se puede realizar concatenacion, el primer parametro no es valido para la concatenacion");
		}
	}else{
		errores.insertarError("Sematncio", "No se puede realizar concatenacion, el primer parametro no es valido para la concatenacion");
	}
};


generacionCodigo.prototype.convertirCadena = function(val1){
	if(val1.tipo.toUpperCase()== "CARACTER"){
		var temp1= this.c3d.getTemporal();
		var temp2= this.c3d.getTemporal();
		var l1= "+, H, 0, "+temp1+"; //apuntador de cadena";
		var l2= "+, H, 1, "+temp2+"; // posicion donde iniciara la cadena";
		var l3 ="<=, "+temp1+", "+temp2+", heap; //insertando apuntador del heap donde incia la cadena";
		var l4 ="+, H, 1, H; // incrementando h";
		var l5 = "<=, H, 1, heap; //ingrensado el tamanho de la cadena nueva ";
		var l6 = "<=, H, "+val1.valor+", heap; // ingresnado caracter al heap";
		var l7 = "<=, H, 34, heap; //caracter de escape de la nueva cadena";
		this.c3d.addCodigo(l1);
		this.c3d.addCodigo(l2);
		this.c3d.addCodigo(l3);
		this.c3d.addCodigo(l4);
		this.c3d.addCodigo(l5);
		this.c3d.addCodigo(l4);
		this.c3d.addCodigo(l6);
		this.c3d.addCodigo(l4);
		this.c3d.addCodigo(l7);
		this.c3d.addCodigo(l4);
		var ret = new EleRetorno();
		ret.setValorCadena(temp1);
		return ret;
	}else if(val1.tipo.toUpperCase()== "ENTERO" || 
		val1.tipo.toUpperCase() == "DECIMAL" || 
		val1.tipo.toUpperCase() == "BOOLEANO"){

		}



};


/* ===================== Punteros ============================== */

/*
generacionCodigo.prototype.obtenerDireccion = function(nodo, ambito,clase,metodo){

	var el = new EleRetorno();
	el.setValoresNulos();
    var nombreVar = nodo.expresion;
	var esAtributo = this.tablaSimbolos.esAtributo(nombreVar, ambitos);
	if(esAtributo!=null){
		var simbVariable = this.tablaSimbolos.obtenerSimbolo(nombreVar,ambitos,esAtributo);
		var posVar;
		var tipoC=0;
		if(simbVariable!= null){
			var tempInicioElemento ="";
			if(esAtributo){
				posVar = this.tablaSimbolos.obtenerPosAtributo(nombreVar,ambitos);
				if(posVar!=-1){
					tipoC =1;
					var temp1= this.c3d.getTemporal();
					var temp2 = this.c3d.getTemporal();
					var temp3 = this.c3d.getTemporal();
					tempInicioElemento= this.c3d.getTemporal();
					var l1 = "+, p, 0, "+temp1+"; //pos this";
					var l2 = "=>, "+temp1+", "+temp2+", stack; ";
					var l3 = "=>, "+temp2+", "+temp3+", heap; ";
					var l4 = "+, "+temp3+", "+posVar+", "+tempInicioElemento+"; // pos donde incia el elemento ";
					this.c3d.addCodigo("//------------------- Obteniendo direccion de un elemento "+ nombreVar);
					this.c3d.addCodigo(l1);
					this.c3d.addCodigo(l2);
					this.c3d.addCodigo(l3);
					this.c3d.addCodigo(l4);
				}else{
					errores.insertarError("Semantico", "No existe "+nombreVar+", error al obtener la direccion");
					return el;
				}
			}else{ // es un elemento local
				posVar = this.tablaSimbolos.obtenerPosLocal(nombreVar,ambitos);
				if(posVar!=-1){
					tipoC=2;
					var temp1= this.c3d.getTemporal();
					tempInicioElemento = this.c3d.getTemporal();
					var l1 = "+, p, "+posVar+", "+temp1+"; ";
					var l2 = "=>, "+temp1+", "+tempInicioElemento+", stack;";
                    this.c3d.addCodigo("//------------------- Obteniendo direccion de un elemento "+ nombreVar);
					this.c3d.addCodigo(l1);
					this.c3d.addCodigo(l2);

				}else{
					errores.insertarError("Semantico", "No existe "+nombreVar+", error al obtener la direccion");
					return el;
				}
			}

			if(tempInicioElemento!=""){
				var tipoV= simbVariable.tipoSimbolo;
				switch(tipoV){
					case "CLASE":{

						break;
					}
					case "ARREGLO":{


						break;
					}
					case "COLA":{


						break;
					}
					case "LISTA":{


						break;
					}
					case "PILA":{


						break;
					}
					case "PUNTERO":{


						break;
					}
					case "VARIABLE":{
						

						

						break;
					}

				}

			}else{
				errores.insertarError("Semantico", "Ocurrio un error la obtener direccion de "+ nombreVar);
				return el;

			}

		}else{
			errores.insertarError("Semantico","No existe "+nombreVar+", error en calculo de direccion");
			return el;
		}
	}else{
		errores.insertarError("Semantico", "No existe "+nombreVar)
		return el;
	}

	return el;


};
*/

generacionCodigo.prototype.obtenerDireccion = function(nodo, ambitos, clase, metodo){
	var ret = new EleRetorno();
	ret.setValoresNulos();
	var expObtenerDireccion = nodo.expresion;
	var retExpresion = this.resolverExpresion(expObtenerDireccion, ambitos, clase, metodo);
	if(retExpresion instanceof EleRetorno){
		if(retExpresion.tipo.toUpperCase() != "NULO"){
			if(retExpresion.referencia.toUpperCase() != "NULO"){
				return retExpresion;
			}else{
				errores.insertarError("Semantico", "Expresion no valida para un obtenerDireccion");
				return ret;
			}
		}else{
			errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion de obtenerDireccion");
			return ret;
		}
	}else{
		errores.insertarError("Semantico", "Ha ocurrido un error al resolver la expresion de ObtenerDireccion");
		return ret;
	}
return ret;
};




generacionCodigo.prototype.reservarMemoria = function(nodo, ambitos, clase, metodo){

	var retNulo = new EleRetorno();
	retNulo.setValoresNulos();
	var resEspacio = this.resolverExpresion(nodo, ambitos, clase, metodo);
	if (resEspacio instanceof EleRetorno){
		if(resEspacio.tipo.toUpperCase()!="NULO"){
			if(resEspacio.tipo.toUpperCase() == "ENTERO"){


			}else{
				errores.insertarError("Semantico", "No coinciden los tipos, "+ resEspacio.tipo+", debe de ser entero");
				return retNulo;
			}
		}else{
			errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion en ReservarMemoria, nulo");
			return retNulo;
		}
	}else{
		errores.insertarError("Semantico", "Ha ocurrido un error al resolver expresion en reservarMemoria");
		return retNulo;
	}
	return retNulo;
};


generacionCodigo.prototype.resolverAcceso = function(nodo, ambitos, clase, metodo){
	var nombreVar = nodo.objeto; //nodo id
	var nombreVariable= nombreVar.nombreId;
	var elementosAcceso = nodo.elementosAcceso;
	var r = new EleRetorno();
	r.setValoresNulos();
	var esAtributo = this.tablaSimbolos.esAtributo(nombreVariable, ambitos);
	if(esAtributo!=null){
		var posVariable;
		var tipoElemento;
		var posFinal;
		var esObj;
		var nombreElemento;
		var simbolo = this.tablaSimbolos.obtenerSimbolo(nombreVariable,ambitos,esAtributo);
		var rolSimbolo =simbolo.tipoSimbolo;
		var banderaED= false; // false heap true stack
		if(esAtributo){
					//es un atributo
					var posVariable = this.tablaSimbolos.obtenerPosAtributo(nombreVariable,ambitos);
					tipoElemento = this.tablaSimbolos.obtenerTipo(nombreVariable, ambitos);
					if(posVariable!= -1){
						var temp1 = this.c3d.getTemporal();
						var temp2 = this.c3d.getTemporal();
						var temp3 = this.c3d.getTemporal();
						var temp4= this.c3d.getTemporal();
						posFinal= this.c3d.getTemporal();
						var l1 = "+, P, 0, "+temp1+"; ";
						var l2 = "=>, "+temp1+", "+ temp2+", stack; // apuntador al heap";
						var l3 = "=>, "+temp2+", "+temp3+", heap;";
						var l4 ="+, "+temp3+", "+posVariable+", "+posFinal+"; ";
						//var l4 ="+, "+temp3+", "+posVariable+", "+temp4+"; ";
						//var l5= "=>, "+temp4+", "+posFinal+", heap; // recuperando pos incial del objeto";
						this.c3d.addCodigo("// Resolviendo un acceso para un atrinuto");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						this.c3d.addCodigo(l3);
						this.c3d.addCodigo(l4);		
						//this.c3d.addCodigo(l5);
						esObj= this.esObjeto(tipoElemento);
					}else{
						errores.insertarError("Semantico", "No existe la variable para el acceso atributo "+ nombreVariable);
						return r;
					}
				}else{
					//es una variable local
					 posVariable = this.tablaSimbolos.obtenerPosLocal(nombreVariable,ambitos);
				     tipoElemento = this.tablaSimbolos.obtenerTipo(nombreVariable,ambitos);
					if(posVariable!= -1){
						var temp1= this.c3d.getTemporal();
						var temp2 = this.c3d.getTemporal();
						posFinal = this.c3d.getTemporal();
						var l1 = "+, P, "+posVariable+", "+temp1+"; // pos del objeto";
						var l2 = "=>, "+temp1+", "+posFinal+", stack; //apuntador al heap del obejto";
						//var l2 = "=>, "+temp1+", "+temp2+", stack; //apuntador al heap del obejto";
						//var l3 = "=>, "+temp2+", "+posFinal+", heap; // pos donde inicial el objeto "+ nombreVariable;
						this.c3d.addCodigo("// ----------------- Resolviendo acceso local ");
						this.c3d.addCodigo(l1);
						this.c3d.addCodigo(l2);
						//this.c3d.addCodigo(l3);
						esObj= this.esObjeto(tipoElemento);
					}else{
						errores.insertarError("Semantico", "No existe la variable para el acceso local "+ nombreVariable);
						return r;
					}
				}// final del else una vairbale local  y del atributo
 
				var bandera=true;
				var elementoTemporal; 
				for(var i =0; i<elementosAcceso.length; i++){
					elementoTemporal = elementosAcceso[i];
					if(bandera){
						if(elementoTemporal instanceof t_id){
							nombreElemento = elementoTemporal.nombreId;
							var posVar = this.tablaSimbolos.obtenerPosAtributoAcceso(tipoElemento, nombreElemento);
							rolSimbolo= this.tablaSimbolos.obtenerPosTipoSimboloAcceso(tipoElemento,nombreElemento);
							if(posVar!=-1 && rolSimbolo!= ""){
								var temp1_4= this.c3d.getTemporal();
								var l1_4= ""; 
								if(!banderaED){
									l1_4= "=>, "+posFinal+", "+temp1_4+", heap; // recuperando pos incial del objeto";
									this.c3d.addCodigo(l1_4);
								}else{
									
									l1_4= "=>, "+posFinal+", "+temp1_4+", stack; // recuperando pos incial del objeto";
									var l1_5 = "=>, "+temp1_4+", "+temp1_4+", heap; // apuntador inciail del objeto ";
									this.c3d.addCodigo(l1_4);
									this.c3d.addCodigo(l1_5);
								}
								
								
								//
								//var temp4 = this.c3d.getTemporal();
								var l4 = "+, "+temp1_4 +", "+posVar+", "+posFinal+";";
								//var l5 = "=>, "+temp4+", "+posFinal+", heap; // pos inicial de otro objeto o valor de una vairble comun ";
								this.c3d.addCodigo(l4);
								//this.c3d.addCodigo(l5);
								tipoElemento = this.tablaSimbolos.obtenerTipoAtributoAcceso(tipoElemento, nombreElemento);
								banderaED=false;
								//bandera= this.esObjeto(tipoElemento);
								//esObj= this.esObjeto(tipoElemento);	
							}else{
								errores.insertarError("Semantico", "No existe el elemento "+nombreElemento);
								return r;
							}	
						}

						if(elementoTemporal instanceof posicion_arreglo){
							nombreElemento = elementoTemporal.nombreArreglo;
							var posicionesArreglo = elementoTemporal.posicionesArreglo;
							var tipoArreglo= this.tablaSimbolos.obtenerTipo(nombreElemento,ambitos);
							if(banderaED){
								var temp1_4= this.c3d.getTemporal();
								var l1_4= "=>, "+posFinal+", "+temp1_4+", stack; // recuperando pos incial del objeto 888";
								this.c3d.addCodigo(l1_4);
								this.c3d.addCodigo("+, "+temp1_4+", 0, "+posFinal+";");
							}
							var apuntadorArreglo = this.obtenerApuntadorPosArreglo(nombreElemento,posicionesArreglo,ambitos,clase,metodo,posFinal,true);
							if(apuntadorArreglo.tipo.toUpperCase() != "NULO"){
								//var temp2_5 = this.c3d.getTemporal();
								//var l2_5= "=>, "+apuntadorArreglo.valor+", "+temp2_5+", heap; //valor que trae el objeto";
								//this.c3d.addCodigo(l2_5);
								banderaED = false;
							//	var retornVal = new EleRetorno();
							tipoElemento = tipoArreglo;
							posFinal= apuntadorArreglo.valor;
							bandera = this.esObjeto(tipoElemento);
								//retornVal.tipo = tipoArreglo;
								//retornVal.valor = temp2_5;
								//retornVal.setReferencia("HEAP",apuntadorArreglo.valor);
								//return retornVal;
							}else{
								errores.insertarError("Semantica", "Ha ocurrido un error al resolver la posicion del arreglo "+ nombreElemento+", en una acceso");

							}
								
						} 

						if(elementoTemporal instanceof llamada_funcion){
							
							nombreElemento = elementoTemporal.nombreFuncion;
							var parametros = elementoTemporal.parametros;
							var firmaMetodo = this.tablaSimbolos.obtenerFirmaMetodo(tipoElemento,parametros.length,nombreElemento);
							var sizeFunActual = this.tablaSimbolos.sizeFuncion(tipoElemento,firmaMetodo);
							if(banderaED){
									var temp1_4= this.c3d.getTemporal();
									var l1_4= "=>, "+posFinal+", "+temp1_4+", stack; // recuperando pos incial del objeto 888";
									//var l1_5 = "=>, "+temp1_4+", "+temp1_4+", heap; // apuntador inciail del objeto ";
									this.c3d.addCodigo(l1_4);
									//this.c3d.addCodigo(l1_5);
									this.c3d.addCodigo("+, "+temp1_4+", 0, "+posFinal+";");
							}
							var retLlamada = this.llamada_funcion(elementoTemporal,ambitos,tipoElemento,firmaMetodo,posFinal,false);
							var clase5 = this.tablaSimbolos.obtenerTipoFuncion(firmaMetodo);
							if(retLlamada.tipo.toUpperCase() == clase5.toUpperCase()){
								tipoElemento = retLlamada.tipo;
								posFinal = retLlamada.referencia;
								banderaED=true;
							}else{
								errores.insertarError("Semantico", "Tipos no coinciden para la funcion en un acceso "+ clase5+", con "+ retLlamada.tipo);
								break;
							}
							
						}

						if(elementoTemporal instanceof funNativa){

							var nombreF = elementoTemporal.nombreFuncion;
							var expresionF = elementoTemporal.expresion;
							
							    var temp1_4= this.c3d.getTemporal();
								var l1_4= "=>, "+posFinal+", "+temp1_4+", heap; // recuperando pos incial del objeto";
								this.c3d.addCodigo(l1_4);
								posFinal=temp1_4;

							if(nombreF.toUpperCase() == "TAMANIO" && rolSimbolo.toUpperCase()=="ARREGLO"){
								bandera =false;
								var temp1=this.c3d.getTemporal();
								var l1= "=>, "+posFinal+", " +temp1+", heap; // obteneindio el size del arreglo "
								this.c3d.addCodigo(l1);
								var ret = new EleRetorno();
								ret.valor= temp1;
								ret.tipo= "ENTERO";
								return ret;
							} // fin del tamanio de una arreglo
							
                            if(nombreF.toUpperCase() == "OBTENER" && rolSimbolo.toUpperCase()== "LISTA"){
								//vamos a insertar en una lista
								bandera = false;
								return this.obtenerEnLista(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo);
							}// FIN del obtener

							if(nombreF.toUpperCase() == "BUSCAR" && rolSimbolo.toUpperCase()== "LISTA"){
								bandera = false;
								return this.buscarEnLista(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo);
							}// fin del buscar de una lista

							if(nombreF.toUpperCase()== "INSERTAR" && rolSimbolo.toUpperCase()== "LISTA"){
								bandera = false;
								this.insertarEstructura(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo);
							}//fin de insertar en lista
							
							if(nombreF.toUpperCase() == "APILAR" && rolSimbolo.toUpperCase()=="PILA"){
								bandera = false;
								this.c3d.addCodigo("//-------------- Apiladndo elemento ");

								return this.insertarEstructura(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo);

							}
							if(nombreF.toUpperCase() == "DESAPILAR" && rolSimbolo.toUpperCase()=="PILA"){
								bandera=false;
							    return this.desapilar(tipoElemento,esAtributo,posFinal,ambitos,clase,metodo);
								
							}
							if(nombreF.toUpperCase() == "ENCOLAR" && rolSimbolo.toUpperCase()=="COLA"){
								bandera = false;
								return this.insertarEstructura(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo);
								
							}

							if(nombreF.toUpperCase() == "DESENCOLAR" && rolSimbolo.toUpperCase()=="COLA"){
								
							}

						}	// fin de las funciones nativas
					}
				}//fin ciclo de valores acceso

				var val = "heap";
				if(banderaED){
					val="stack";
				}
						var tempR = this.c3d.getTemporal();
						var l_R = "=>, "+posFinal+", "+tempR+", "+val+"; // valor a retoranar del acceso";
						this.c3d.addCodigo(l_R);
				        var ret = new EleRetorno();
						ret.valor= tempR;
						ret.tipo= tipoElemento;
						ret.setReferencia(val,posFinal);
						return ret;
			}else{
				errores.insertarError("Semantico", "Ha ocurrido un error "+nombreVariable+", no existe");
				return r;
			}

return r;
};

generacionCodigo.prototype.insertarEstructura= function(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo){
	var posSize = this.c3d.getTemporal();
								var valSize = this.c3d.getTemporal();
								var posPtr= this.c3d.getTemporal();
								var valPtr = this.c3d.getTemporal();
								var posIndice= this.c3d.getTemporal();
								var posValor = this.c3d.getTemporal();
								var etiqCiclo = this.c3d.getEtiqueta();
								var etiqV= this.c3d.getEtiqueta();
								var etiqF= this.c3d.getEtiqueta();
								var etiqSalida = this.c3d.getEtiqueta();

								if(esAtributo){
									//var l1_1= "=>, "+posFinal+", "+posSize+", heap; //posicion del size de la lista";
									var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
									this.c3d.addCodigo(l1_1);

								}else{
									//es una local
									var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
									this.c3d.addCodigo(l1_1);
									
								}
								    var l1_2= "=>, "+posSize+", "+valSize+", heap; // valor del size de una lista";
									var l1_3= "+, "+posSize+", 1, "+posPtr+"; // pos de puntero";
									var l1_4= "=>, "+posPtr+", "+valPtr+", heap; //valor del puntero";
									var l1_5= "+, "+posPtr+", 1, "+posIndice+"; // pos del indice";
									var l1_6= "+, "+posIndice+", 1, "+posValor+"; // pos del valor";
									this.c3d.addCodigo(l1_2);
									this.c3d.addCodigo(l1_3);
									this.c3d.addCodigo(l1_4);
									this.c3d.addCodigo(l1_5);
									this.c3d.addCodigo(l1_6);
									var l1_7 = "jmp, , , "+etiqCiclo+";";
									var l1_8= etiqCiclo+":";
									var l1_9= "je, "+valPtr+", -1, "+etiqV+";";
									var l1_10="jmp, , , "+etiqF+";";
									var l1_11= "jmp, , ,"+etiqV+";";
									var l1_12= etiqV+":";
									this.c3d.addCodigo(l1_7);
									this.c3d.addCodigo(l1_8);
									this.c3d.addCodigo(l1_9);
									this.c3d.addCodigo(l1_10);
									this.c3d.addCodigo(l1_11);
									this.c3d.addCodigo(l1_12);
									var resExpre= this.resolverExpresion(expresionF,ambitos,clase,metodo);
									if((resExpre.tipo.toUpperCase()!= "NULO") && (resExpre.tipo.toUpperCase() == tipoElemento.toUpperCase())){
										var l1_13 = "+, "+valSize+", 1, "+valSize+"; // incrementandor en uno el size de la lista";
										var l1_14 = "<=, "+posSize+", "+valSize+", heap; // guarnado el size de la lista";
										var l1_15 = "<=, "+posPtr+", H, heap; // guardando el nuevo apuntador ";
										var l1_16 = "<=, "+posIndice+", "+ valSize+", heap; // guarando el indice del nuevo elemento";
										var l1_17 = "<=, "+posValor+", "+resExpre.valor+", heap; // guardando el valor del nuevo insert en la lista";
										var l1_18 = "<=, H, -1, heap; // ingresando el nulo del atributo siguiente";
										var l1_19 = "+, H, 3, H; // incrementado el h";
										var l1_20 = "jmp, , , "+etiqSalida+";";
										var l1_21 = "jmp, , , "+etiqF+";";
										var l1_22 = etiqF+":";
										var l1_23 = "+, "+valPtr+", 0, "+posPtr+"; // pos del apuntador";
										var l1_24 = "=>, "+posPtr+", "+valPtr+", heap; // valor del apuntador";
										var l1_25 = "+, "+posPtr+", 1, "+posIndice+"; // pos del indice";
										var l1_26 = "+, "+posIndice+", 1, "+posValor+"; //pos valor ";
										var l1_27 = "jmp, , , "+etiqCiclo+";";
										var l1_28 = "jmp, , , "+etiqSalida+";";
										var l1_29 = etiqSalida+":";
										this.c3d.addCodigo(l1_13);
										this.c3d.addCodigo(l1_14);
										this.c3d.addCodigo(l1_15);
										this.c3d.addCodigo(l1_16);
										this.c3d.addCodigo(l1_17);
										this.c3d.addCodigo(l1_18);
										this.c3d.addCodigo(l1_19);
										this.c3d.addCodigo(l1_20);
										this.c3d.addCodigo(l1_21);
										this.c3d.addCodigo(l1_22);
										this.c3d.addCodigo(l1_23);
										this.c3d.addCodigo(l1_24);
										this.c3d.addCodigo(l1_25);
										this.c3d.addCodigo(l1_26);
										this.c3d.addCodigo(l1_27);
										this.c3d.addCodigo(l1_28);
										this.c3d.addCodigo(l1_29);
										var ret = new EleRetorno();
										ret.valor= valSize;
										ret.tipo= "ENTERO";
										return ret;

									}else{
										errores.insertarError("SEmantico", "Tipos no coinciden "+ resExpre.tipo+", con "+ tipoElemento);
									}

};


generacionCodigo.prototype.buscarEnLista = function(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo){
	                            var posSize = this.c3d.getTemporal();
								var valSize = this.c3d.getTemporal();
								var posPtr= this.c3d.getTemporal();
								var valPtr = this.c3d.getTemporal();
								var posIndice= this.c3d.getTemporal();
								var posValor = this.c3d.getTemporal();
								var valIndice= this.c3d.getTemporal(); //
								var valValor = this.c3d.getTemporal();
								if(esAtributo){
									//var l1_1= "=>, "+posFinal+", "+posSize+", heap; //posicion del size de la lista";
									var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
									this.c3d.addCodigo(l1_1);

								}else{
									//es una local
									var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
									this.c3d.addCodigo(l1_1);
									
								}
								    var l1_2= "=>, "+posSize+", "+valSize+", heap; // valor del size de una lista";
									var l1_3= "+, "+posSize+", 1, "+posPtr+"; // pos de puntero";
									var l1_4= "=>, "+posPtr+", "+valPtr+", heap; //valor del puntero";
									var l1_5= "+, "+posPtr+", 1, "+posIndice+"; // pos del indice";
									var l1_5_1= "=>, "+posIndice+", "+valIndice+", heap; // valor del indice";
									var l1_6= "+, "+posIndice+", 1, "+posValor+"; // pos del valor";
									var l1_87 = "=>, "+posValor+", "+valValor+", heap; // valor del primer valor de la lista";
									this.c3d.addCodigo(l1_2);
									this.c3d.addCodigo(l1_3);
									this.c3d.addCodigo(l1_4);
									this.c3d.addCodigo(l1_5);
									this.c3d.addCodigo(l1_6);
									this.c3d.addCodigo(l1_87);

									var etiq1= this.c3d.getEtiqueta();
									var etiq2= this.c3d.getEtiqueta();
									var etiq3= this.c3d.getEtiqueta();
									var etiq4= this.c3d.getEtiqueta();
									var etiq5= this.c3d.getEtiqueta();
									var etiq6= this.c3d.getEtiqueta();
									
									
									var res= this.resolverExpresion(expresionF,ambitos,clase,metodo);
									if(res.tipo.toUpperCase() != "NULO" && (res.tipo.toUpperCase() == tipoElemento.toUpperCase())){
										var l1_7 = "jmp, , , "+etiq1+";";
										var l1_8 = etiq1+":";
										var l1_9 = "jne, "+valPtr+", -1, "+etiq2+";";
										var l1_10 = "jmp, , , "+etiq3+";";
										var l1_11 = "jmp, , , "+etiq2+";";
										var l1_12 = etiq2+":";
										var l1_13 = "je, "+valValor+", "+res.valor+", "+etiq4+";";
										var l1_14 = "jmp, , , "+etiq5+";";
										var l1_15 = "jmp, , , "+etiq4+";";
										var l1_16 = etiq4+":";
										var l1_17 = "=>, "+posIndice+", "+posFinal+", heap; // valor del indice ";
										var l1_18 = "jmp, , , "+etiq6+";";
										var l1_19 = "jmp, , , "+etiq5+";";
										var l1_20 = etiq5+":";
										var l1_21 = "+, "+valPtr+", 0, "+posPtr+";";
										var l1_22 = "=>, "+posPtr+", "+valPtr+", heap;";
										var l1_23 = "+, "+posPtr+", 1, "+posIndice+";";
										var l1_24 = "+, "+posIndice+", 1, "+posValor+"; // pos del valor";
										var l1_25 = "=>, "+posValor+", "+valValor+", heap;// valor del valor "; 
										var l1_26 = "jmp, , , "+etiq1+";";
										var l1_27 = "jmp, , , "+etiq3+";";
										var l1_28 = etiq3+":";
										var l1_29 = "jmp, , , "+etiq6+";";
										var l1_30 = etiq6+":";

										this.c3d.addCodigo("// ------ funcion BUSCAR en una lista ---");
										this.c3d.addCodigo(l1_7);
										this.c3d.addCodigo(l1_8);
										this.c3d.addCodigo(l1_9);
										this.c3d.addCodigo(l1_10);
										this.c3d.addCodigo(l1_11);
										this.c3d.addCodigo(l1_12);
										this.c3d.addCodigo(l1_13);
										this.c3d.addCodigo(l1_14);
										this.c3d.addCodigo(l1_15);
										this.c3d.addCodigo(l1_16);
										this.c3d.addCodigo(l1_17);
										this.c3d.addCodigo(l1_18);
										this.c3d.addCodigo(l1_19);
										this.c3d.addCodigo(l1_20);
										this.c3d.addCodigo(l1_21);
										this.c3d.addCodigo(l1_22);
										this.c3d.addCodigo(l1_23);
										this.c3d.addCodigo(l1_24);
										this.c3d.addCodigo(l1_25);
										this.c3d.addCodigo(l1_26);
										this.c3d.addCodigo(l1_27);
										this.c3d.addCodigo(l1_28);
										this.c3d.addCodigo(l1_29);
										this.c3d.addCodigo(l1_30);
										var ret = new EleRetorno();
										ret.valor= posFinal;
										ret.tipo= "ENTERO";
										return ret;


									}else{
										errores.insertarError("Semantico", "Tipo no valido para el indece de una lista "+ res.tipo);
									}

};


generacionCodigo.prototype.obtenerEnLista = function(tipoElemento,esAtributo,posFinal,expresionF,ambitos,clase,metodo){
	var posSize = this.c3d.getTemporal();
	var valSize = this.c3d.getTemporal();
	var posPtr= this.c3d.getTemporal();
	var valPtr = this.c3d.getTemporal();
	var posIndice= this.c3d.getTemporal();
	var posValor = this.c3d.getTemporal();
	var valIndice= this.c3d.getTemporal(); //
	var valValor = this.c3d.getTemporal();
	if(esAtributo){
		//var l1_1= "=>, "+posFinal+", "+posSize+", heap; //posicion del size de la lista";
		var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
		this.c3d.addCodigo(l1_1);

	}else{
		//es una local
		var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
		this.c3d.addCodigo(l1_1);
		
	}
		var l1_2= "=>, "+posSize+", "+valSize+", heap; // valor del size de una lista";
		var l1_3= "+, "+posSize+", 1, "+posPtr+"; // pos de puntero";
		var l1_4= "=>, "+posPtr+", "+valPtr+", heap; //valor del puntero";
		var l1_5= "+, "+posPtr+", 1, "+posIndice+"; // pos del indice";
		var l1_5_1= "=>, "+posIndice+", "+valIndice+", heap; // valor del indice";
		var l1_6= "+, "+posIndice+", 1, "+posValor+"; // pos del valor";
		var l1_87 = "=>, "+posIndice+", "+valIndice+", heap; // valor del indice actual";
		this.c3d.addCodigo(l1_2);
		this.c3d.addCodigo(l1_3);
		this.c3d.addCodigo(l1_4);
		this.c3d.addCodigo(l1_5);
		this.c3d.addCodigo(l1_6);
		this.c3d.addCodigo(l1_87);

		var etiq1= this.c3d.getEtiqueta();
		var etiq2= this.c3d.getEtiqueta();
		var etiq3= this.c3d.getEtiqueta();
		var etiq4= this.c3d.getEtiqueta();
		var etiq5= this.c3d.getEtiqueta();
		var etiq6= this.c3d.getEtiqueta();
		var etiq7= this.c3d.getEtiqueta();
		
		var res= this.resolverExpresion(expresionF,ambitos,clase,metodo);
		if(res.tipo.toUpperCase() == "ENTERO"){
			var l1_7 = "jge, "+ res.valor+", 0, "+etiq1+";";
			var l1_8 = "jmp, , , "+etiq2+";";
			var l1_9 = "jmp, , , "+etiq1+";";
			var l1_10= etiq1+":";
			var l1_11= "jle, "+res.valor+", "+valSize+", "+ etiq3+";";
			var l1_12= "jmp, , , "+etiq4+";";
			var l1_13= "jmp, , , "+etiq3+";";
			var l1_14 = etiq3+":";
			var l1_15 = "je, "+res.valor+", "+ valIndice+", "+ etiq5+";";
			var l1_16 = "jmp, , , "+etiq6+";";
			var l1_17 = "jmp, , , "+etiq5+";";
			var l1_18 = etiq5+":";
			var l1_19 = "=>, "+posValor+", "+posFinal+", heap; // valor de la poscion buscanda en la listsa "; ///************************** */
			var l1_20 = "jmp, , , "+ etiq7+";";
			var l1_21 = "jmp, , , "+ etiq6+";";
			var l1_22 = etiq6+":";
			var l1_23 = "+, "+valPtr+", 0, "+posPtr+";";
			var l1_24 = "=>, "+posPtr+", "+valPtr+", heap;";
			var l1_25 = "+, "+posPtr+", 1, "+posIndice+"; // pos indice";
			var l1_26 = "+, "+posIndice+", 1, "+posValor+"; // pos valor";
			var l1_27 = "=>, "+posIndice+", "+valIndice+", heap; //val del indice";
			var l1_28 = "jmp, , , "+etiq3+";";
			var l1_29_1 = "jmp, , , "+etiq2+";";
			var l1_30_1 = etiq2+":";
			var l1_29_2 = "jmp, , , "+etiq4+";";
			var l1_30_2 = etiq4+":";
			var l1_29 = "jmp, , , "+etiq7+";";
			var l1_30 = etiq7+":";
			this.c3d.addCodigo("// ------ funcion obtener en una lista ---");
			this.c3d.addCodigo(l1_7);
			this.c3d.addCodigo(l1_8);
			this.c3d.addCodigo(l1_9);
			this.c3d.addCodigo(l1_10);
			this.c3d.addCodigo(l1_11);
			this.c3d.addCodigo(l1_12);
			this.c3d.addCodigo(l1_13);
			this.c3d.addCodigo(l1_14);
			this.c3d.addCodigo(l1_15);
			this.c3d.addCodigo(l1_16);
			this.c3d.addCodigo(l1_17);
			this.c3d.addCodigo(l1_18);
			this.c3d.addCodigo(l1_19);
			this.c3d.addCodigo(l1_20);
			this.c3d.addCodigo(l1_21);
			this.c3d.addCodigo(l1_22);
			this.c3d.addCodigo(l1_23);
			this.c3d.addCodigo(l1_24);
			this.c3d.addCodigo(l1_25);
			this.c3d.addCodigo(l1_26);
			this.c3d.addCodigo(l1_27);
			this.c3d.addCodigo(l1_28);
			this.c3d.addCodigo(l1_29_1);
			this.c3d.addCodigo(l1_30_1);
			this.c3d.addCodigo(l1_29_2);
			this.c3d.addCodigo(l1_30_2);
			this.c3d.addCodigo(l1_29);
			this.c3d.addCodigo(l1_30);
			var ret = new EleRetorno();
		    ret.valor= posFinal;
		    ret.tipo= tipoElemento;
			return ret;
		}else{
			errores.insertarError("Semantico", "Tipo no valido para el indece de una lista "+ res.tipo);
		}
};

generacionCodigo.prototype.desapilar = function(tipoElemento,esAtributo,posFinal,ambitos,clase,metodo){
	var posFinal2= posFinal;
	var posSize = this.c3d.getTemporal();
	var valSize = this.c3d.getTemporal();
	var posPtr= this.c3d.getTemporal();
	var valPtr = this.c3d.getTemporal();
	var posIndice= this.c3d.getTemporal();
	var posValor = this.c3d.getTemporal();
	var valIndice= this.c3d.getTemporal(); //
	var valValor = this.c3d.getTemporal();
	var temp = this.c3d.getTemporal();
	if(esAtributo){
		//var l1_1= "=>, "+posFinal+", "+posSize+", heap; //posicion del size de la lista";
		var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
		this.c3d.addCodigo(l1_1);

	}else{
		//es una local
		var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
		this.c3d.addCodigo(l1_1);
		
	}
		var l1_2= "=>, "+posSize+", "+valSize+", heap; // valor del size de una lista";
		var l1_3= "+, "+posSize+", 1, "+posPtr+"; // pos de puntero";
		var l1_4= "=>, "+posPtr+", "+valPtr+", heap; //valor del puntero";
		var l1_5= "+, "+posPtr+", 1, "+posIndice+"; // pos del indice";
		var l1_5_1= "=>, "+posIndice+", "+valIndice+", heap; // valor del indice";
		var l1_6= "+, "+posIndice+", 1, "+posValor+"; // pos del valor";
		var l1_87 = "=>, "+posIndice+", "+valIndice+", heap; // valor del indice actual";
		this.c3d.addCodigo(l1_2);
		this.c3d.addCodigo(l1_3);
		this.c3d.addCodigo(l1_4);
		this.c3d.addCodigo(l1_5);
		this.c3d.addCodigo(l1_6);
		this.c3d.addCodigo(l1_87);
		var penultimo = this.c3d.getTemporal();
		var l1_88 = "-, "+valSize+", 1, "+penultimo+"; // siguiente poscions a la que apuntara la cabeza de la pila";
		this.c3d.addCodigo(l1_88);

		var etiq1= this.c3d.getEtiqueta();
		var etiq2= this.c3d.getEtiqueta();
		var etiq3= this.c3d.getEtiqueta();
		var etiq4= this.c3d.getEtiqueta();
		var etiq5= this.c3d.getEtiqueta();
		var etiq6= this.c3d.getEtiqueta();
		var etiq7= this.c3d.getEtiqueta();

		
		var l1_7 = "jge, "+penultimo+", 0, "+etiq1+";";
		var l1_8 = "jmp, , , "+etiq2+";";
		var l1_9 = "jmp, , , "+etiq1+";";
		var l1_10 = etiq1+":";
		var l1_11 = "je, "+penultimo+", "+valIndice+", "+etiq3+";";
		var l1_12 = "jmp, , , "+etiq4+";";
		var l1_13 = "jmp, , , "+etiq3+";";
		var l1_14 = etiq3+":";

		var l1_15 =  "+, "+posPtr+", 0, "+temp+"; // pos del puntero donde insertarmemos un nulo";
		var l1_16 = "+, "+valPtr+", 0, "+posPtr+";";
		var l1_17 = "=>, "+posPtr+", "+valPtr+", heap; // val del punteor del siguiente elmento";
		var l1_17_1 = "+, "+posPtr+", 1, "+posIndice+";";
		var l1_18 = "+, "+posIndice+", 1, "+posValor+";";
		var l1_19 = "=>, "+posIndice+", "+valIndice+", heap; //valor del proximo indice";
		var l1_20 = "<=, "+temp+", -1, heap; // direccionando a nulo (nueva cabeza de al pila)";
		var l1_21 = "jmp, , , "+etiq1+";";
		
		var l1_22 = "jmp, , , "+etiq4+";";
		var l1_23 = etiq4+":";
		var l1_25 = "je, "+valSize+", "+valIndice+", "+etiq5+";"
		var l1_26 = "jmp, , , "+etiq6+";";
		
		var l1_27 = "jmp, , , "+etiq5+";";
		var l1_28 = etiq5+":";
		var l1_29 = "=>, "+posValor+", "+posFinal+", heap; // valor de la posicion que saldra de la pila";
		var l1_30 = "<=, "+posSize+", "+penultimo+", heap; // cambiando el size de la pila";
		var l1_31 = "jmp, , , "+etiq7+";";
		var l1_32= "jmp, , , "+etiq6+";";
		var l1_33 = etiq6+":";

		var l1_34 = "+, "+valPtr+", 0, "+posPtr+";";
		var l1_35 = "=>, "+posPtr+", "+valPtr+", heap; // val del punteor del siguiente elmento";
		var l1_36 = "+, "+posPtr+", 1, "+posIndice+";";
		var l1_37 = "+, "+posIndice+", 1, "+posValor+";";
		var l1_38 = "=>, "+posIndice+", "+valIndice+", heap; //valor del proximo indice";
		var l1_39 = "jmp, , , "+etiq1+";";
		
		var l1_40= "jmp, , , "+etiq7+";";
		var l1_41 = etiq7+":";

		var l1_42= "jmp, , , "+etiq2+";";
		var l1_43 = etiq2+":";
	
			

			this.c3d.addCodigo("// ------ funcion desapilar de una pila  ---");
			this.c3d.addCodigo(l1_7);
			this.c3d.addCodigo(l1_8);
			this.c3d.addCodigo(l1_9);
			this.c3d.addCodigo(l1_10);
			this.c3d.addCodigo(l1_11);
			this.c3d.addCodigo(l1_12);
			this.c3d.addCodigo(l1_13);
			this.c3d.addCodigo(l1_14);
			this.c3d.addCodigo(l1_15);
			this.c3d.addCodigo(l1_16);
			this.c3d.addCodigo(l1_17);
			this.c3d.addCodigo(l1_17_1);
			this.c3d.addCodigo(l1_18);
			this.c3d.addCodigo(l1_19);
			this.c3d.addCodigo(l1_20);
			this.c3d.addCodigo(l1_21);
			this.c3d.addCodigo(l1_22);
			this.c3d.addCodigo(l1_23);
			
			this.c3d.addCodigo(l1_25);
			this.c3d.addCodigo(l1_26);
			this.c3d.addCodigo(l1_27);
			this.c3d.addCodigo(l1_28);
			this.c3d.addCodigo(l1_29);
			this.c3d.addCodigo(l1_30);
			this.c3d.addCodigo(l1_31);
			this.c3d.addCodigo(l1_32);
			this.c3d.addCodigo(l1_33);
			this.c3d.addCodigo(l1_34);
			this.c3d.addCodigo(l1_35);
			this.c3d.addCodigo(l1_36);
			this.c3d.addCodigo(l1_37);
			this.c3d.addCodigo(l1_38);
			this.c3d.addCodigo(l1_39);
			this.c3d.addCodigo(l1_40);
			this.c3d.addCodigo(l1_41);
			this.c3d.addCodigo(l1_42);
			this.c3d.addCodigo(l1_43);
			
			
			var ret = new EleRetorno();
		    ret.valor= posFinal;
		    ret.tipo= tipoElemento;
			return ret;

			
			
};


generacionCodigo.prototype.desencolar = function(tipoElemento,esAtributo,posFinal,ambitos,clase,metodo){
	var posSize = this.c3d.getTemporal();
	var valSize = this.c3d.getTemporal();
	var posPtr= this.c3d.getTemporal();
	var valPtr = this.c3d.getTemporal();
	var posIndice= this.c3d.getTemporal();
	var posValor = this.c3d.getTemporal();
	var valIndice= this.c3d.getTemporal(); //
	var valValor = this.c3d.getTemporal();
	var temp = this.c3d.getTemporal();
	if(esAtributo){
		//var l1_1= "=>, "+posFinal+", "+posSize+", heap; //posicion del size de la lista";
		var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
		this.c3d.addCodigo(l1_1);

	}else{
		//es una local
		var l1_1= "+, "+posFinal+", 0, "+posSize+"; // posicion de; size de una lista";
		this.c3d.addCodigo(l1_1);
		
	}
		var l1_2= "=>, "+posSize+", "+valSize+", heap; // valor del size de una lista";
		var l1_3= "+, "+posSize+", 1, "+posPtr+"; // pos de puntero";
		var l1_4= "=>, "+posPtr+", "+valPtr+", heap; //valor del puntero";
		var l1_5= "+, "+posPtr+", 1, "+posIndice+"; // pos del indice";
		var l1_5_1= "=>, "+posIndice+", "+valIndice+", heap; // valor del indice";
		var l1_6= "+, "+posIndice+", 1, "+posValor+"; // pos del valor";
		var l1_87 = "=>, "+posIndice+", "+valIndice+", heap; // valor del indice actual";
		this.c3d.addCodigo(l1_2);
		this.c3d.addCodigo(l1_3);
		this.c3d.addCodigo(l1_4);
		this.c3d.addCodigo(l1_5);
		this.c3d.addCodigo(l1_6);
		this.c3d.addCodigo(l1_87);
		var penultimo = this.c3d.getTemporal();
		var l1_88 = "-, "+valSize+", 1, "+penultimo+"; // siguiente poscions a la que apuntara la cabeza de la pila";
		this.c3d.addCodigo(l1_88);

		var etiq1= this.c3d.getEtiqueta();
		var etiq2= this.c3d.getEtiqueta();
		var etiq3= this.c3d.getEtiqueta();
		var etiq4= this.c3d.getEtiqueta();
		var etiq5= this.c3d.getEtiqueta();
		var etiq6= this.c3d.getEtiqueta();
		var etiq7= this.c3d.getEtiqueta();

		
		
			

			this.c3d.addCodigo("// ------ funcion descolar de una cola  ---");
			this.c3d.addCodigo(l1_7);
			this.c3d.addCodigo(l1_8);
			this.c3d.addCodigo(l1_9);
			this.c3d.addCodigo(l1_10);
			this.c3d.addCodigo(l1_11);
			this.c3d.addCodigo(l1_12);
			this.c3d.addCodigo(l1_13);
			this.c3d.addCodigo(l1_14);
			this.c3d.addCodigo(l1_15);
			this.c3d.addCodigo(l1_16);
			this.c3d.addCodigo(l1_17);
			this.c3d.addCodigo(l1_17_1);
			this.c3d.addCodigo(l1_18);
			this.c3d.addCodigo(l1_19);
			this.c3d.addCodigo(l1_20);
			this.c3d.addCodigo(l1_21);
			this.c3d.addCodigo(l1_22);
			this.c3d.addCodigo(l1_23);
			
			this.c3d.addCodigo(l1_25);
			this.c3d.addCodigo(l1_26);
			this.c3d.addCodigo(l1_27);
			this.c3d.addCodigo(l1_28);
			this.c3d.addCodigo(l1_29);
			this.c3d.addCodigo(l1_30);
			this.c3d.addCodigo(l1_31);
			this.c3d.addCodigo(l1_32);
			this.c3d.addCodigo(l1_33);
			this.c3d.addCodigo(l1_34);
			this.c3d.addCodigo(l1_35);
			this.c3d.addCodigo(l1_36);
			this.c3d.addCodigo(l1_37);
			this.c3d.addCodigo(l1_38);
			this.c3d.addCodigo(l1_39);
			this.c3d.addCodigo(l1_40);
			this.c3d.addCodigo(l1_41);
			this.c3d.addCodigo(l1_42);
			this.c3d.addCodigo(l1_43);
			
			
			var ret = new EleRetorno();
		    ret.valor= posFinal;
		    ret.tipo= tipoElemento;
			return ret;

			
			
};

generacionCodigo.prototype.crearPunteroNulo = function(nodo, ambitos, clase, metodo){

	var punteroDecla = nodo.puntero;
	var nombreP = punteroDecla.nombrePuntero;
	var tipoP= punteroDecla.tipoPuntero;
	var esAtributo = this.tablaSimbolos.esAtributo(nombreP,ambitos);
	var retorn_nulo = new EleRetorno();	
	retorn_nulo.setValoresNulos();
	var ret_puntero;

	if(esAtributo!=null){
		var simb = this.tablaSimbolos.obtenerSimbolo(nombreP,ambitos,esAtributo);
		var posPuntero= -1;
		var tempInicio = "";
		if(esAtributo){
			posPuntero = this.tablaSimbolos.obtenerPosAtributo(nombreP, ambitos);
			if(posPuntero!=-1){
				var temp1= this.c3d.getTemporal();
				var temp2= this.c3d.getTemporal();
				var temp3 = this.c3d.getTemporal();
				var temp4= this.c3d.getTemporal(); //val
				var tempRef= this.c3d.getTemporal();
				var l1= "+, P, 0, "+temp1+";// pos del this";
				var l2= "=>, "+temp1+", "+temp2+", stack; // apuntador al heap";
				var l3 = "=>, "+temp2+", "+temp3+", heap; ";
				var l4 = "+, "+temp3+", "+posPuntero+", "+temp4+"; // pos donde inicia el puntero";
				var l5 = "<=, "+temp4+", H, heap; // guarandod pntero donde inicia el puntero ";
				var l5_1= "+, H, 0, "+tempRef+"; // pos de REferencia";
				var l6 = "<=, H, 110, heap; //guardano una n de null en el heap";
				var l7 = "+, H, 1, H; // incrementando uno en h";
				var l8 = "<=, H, -1, heap; // guarando una posicion que no existe indica nulo";
				var l9 = "+, H, 1, H; // incrementando uno en h";
				this.c3d.addCodigo("// ---------------- Creando un puntero atributp nulo ---------");
				this.c3d.addCodigo(l1);
				this.c3d.addCodigo(l2);
				this.c3d.addCodigo(l3);
				this.c3d.addCodigo(l4);
				this.c3d.addCodigo(l5);
				this.c3d.addCodigo(l5_1);
				this.c3d.addCodigo(l6);
				this.c3d.addCodigo(l7);
				this.c3d.addCodigo(l8);
				this.c3d.addCodigo(l9);
				this.c3d.addCodigo("// ---------- Fin decla de puntero -------------");
				ret_puntero = new EleRetorno();
				ret_puntero.tipo=tipoP;
				ret_puntero.valor= temp4;
				ret_puntero.setReferencia("NULO2", tempRef);
				return ret_puntero;

			}else{
				errores.insertarError("Semantico", "El puntro de nonbre "+ nombreP+", no existe");
				return retorn_nulo;
			}
		}else{
			posPuntero = this.tablaSimbolos.obtenerPosLocal(nombreP,ambitos);

			if(posPuntero!=-1){
				var temp1 = this.c3d.getTemporal();
				var temp2 = this.c3d.getTemporal();
				var tempVal = this.c3d.getTemporal();
				var tempRef = this.c3d.getTemporal();
				var l1= "+, P, "+posPuntero+", "+temp1+"; // posicion de el puntero nombre "+nombreP;
				var l2 = "<=, "+temp1+", H, stack; //guarando en el stack el apuntador al heap";
				var l2_1= "+, H, 0, "+tempVal+"; // pos del heap donde inicia el puntero";
				var l3 = "+, H, 1, "+temp2+"; // pos donde iniciara el puntero";
				var l4 = "<=, H, "+temp2+", heap; // heap[h]= "+temp2;
				var l5 = "+, H, 1, H; // incrementando h en uno";
				var l5_1= "+, H, 0, "+tempRef+"; // pos del heap donde se guardar la esdtructara de la referencia ";
				var l6 = "<=, H, 110, heap; // guarndo n de nulo en el puntero";
				var l7 = "+, H, 1, H; // incrementando h en uno";
				var l8 = "<=, H, 12500, heap; // posicion nula dentro del heap";
				var l9 = "+, H, 1, H; // incrementando h en uno";
				this.c3d.addCodigo("// ---------------- Creando un puntero local nulo ---------");
				this.c3d.addCodigo(l1);
				this.c3d.addCodigo(l2);
				this.c3d.addCodigo(l2_1);
				this.c3d.addCodigo(l3);
				this.c3d.addCodigo(l4);
				this.c3d.addCodigo(l5);
				this.c3d.addCodigo(l5_1);
				this.c3d.addCodigo(l6);
				this.c3d.addCodigo(l7);
				this.c3d.addCodigo(l8);
				this.c3d.addCodigo(l9);
				this.c3d.addCodigo("// ---------- Fin decla de puntero -------------");
				ret_puntero = new EleRetorno();
				ret_puntero.tipo=tipoP;
				ret_puntero.valor= tempVal;
				ret_puntero.setReferencia("NULO2", tempRef);
				return ret_puntero;
			}else{
				errores.insertarError("Semantico", "El puntero no existe "+ nombreP);
				return retorn_nulo;
			}
		}

	}else{
		errores.insertarError("Semantico", "Elemento de nombre "+ nombreP+", no existe");
		return retorn_nulo;
	}

    return retorn_nulo;
};


generacionCodigo.prototype.sumarAsciiCadena = function(pos){

	var etiqCiclo = this.c3d.getEtiqueta();
	var temp1 = this.c3d.getTemporal();
	var l1 = "=>, "+pos+", "+temp1+", heap; // apunt al heap donde inicia la cadena";
	var temp2 = this.c3d.getTemporal();
	var l2 = "+, "+temp1+", 1, "+temp2+"; // pos donde incia la cadena";
	var temp3 = this.c3d.getTemporal();
	var l3 = "=>, "+ temp2+", "+temp3+", heap; // valor caracter  de la cadena";
	var temp4 = this.c3d.getTemporal();
	var l4 = "+, 0, 0, "+temp4+"; //acumulador de la cadena";
	var etiqV = this.c3d.getEtiqueta();
	var etiqF = this.c3d.getEtiqueta();
	this.c3d.addCodigo("// ------------ Obtenieido suma de caracteres de una cadena --------");
	this.c3d.addCodigo(l1);
	this.c3d.addCodigo(l2);
	this.c3d.addCodigo(l3);
	this.c3d.addCodigo(l4);
	var l9 = "jmp, , , "+etiqCiclo+";"
	this.c3d.addCodigo(l9); //
	this.c3d.addCodigo(etiqCiclo+": //etiquera ciclo suma cadena");
	var l5 =  "jne, "+temp3+", 34, "+etiqV+ ";\njmp, , , "+etiqF+";";
	this.c3d.addCodigo(l5);
	this.c3d.addCodigo(etiqV+":");
	var l6 = "+, "+temp4+", "+temp3+", "+temp4+"; // sumando los caracteres ";
	var l7 = "+, "+temp2+", 1, "+temp2+"; // sumando una posicion";
	var l8 = "=>, "+temp2+", "+temp3+", heap; // obteniendo el valor del caracter ";
	//var l9 = "jmp, , , "+etiqCiclo+";"
	var l10= etiqF+":";
	this.c3d.addCodigo(l6);
	this.c3d.addCodigo(l7);
	this.c3d.addCodigo(l8);
	this.c3d.addCodigo(l9);
	this.c3d.addCodigo(l10);

	return temp4;

};

generacionCodigo.prototype.validarRelacional = function(val1, val2, signo){
	var retNulo = new EleRetorno();
	retNulo.setValoresNulos();

	if(!(this.esNulo(val1.tipo) || this.esNulo(val2.tipo))){
		if(!(this.esVacio(val1.tipo) || this.esVacio(val2.tipo))){
			if(!(this.esBool(val1.tipo) || this.esBool(val2.tipo))){
				var etiqV = this.c3d.getEtiqueta();
				var etiqF = this.c3d.getEtiqueta();
				var cod="";
				var res;
				if((this.esInt(val1.tipo) || this.esDecimal(val1.tipo) || this.esChar(val1.tipo))&&
					this.esInt(val2.tipo) || this.esDecimal(val2.tipo) || this.esChar(val2.tipo)){
						cod=signo+", "+val1.valor+", "+val2.valor+", "+etiqV+";\njmp, , , "+etiqF+";";
						res = new nodoCondicion(cod);
						res.addFalsa(etiqF);
						res.addVerdadera(etiqV);
						return res;
					}else if(this.esChar(val1.tipo) && this.esCadena(val2.tipo)){
						var sumaCadena = this.sumarAsciiCadena(val2.valor);
						cod=signo+", "+val1.valor+", "+sumaCadena+", "+etiqV+";\njmp, , , "+etiqF+";";
						res = new nodoCondicion(cod);
						res.addFalsa(etiqF);
						res.addVerdadera(etiqV);
						return res;
					}else if(this.esCadena(val1.tipo) && this.esChar(val2.tipo)){
						var sumaCadena = this.sumarAsciiCadena(val1.valor);
						cod=signo+", "+sumaCadena+", "+val2.valor+", "+etiqV+";\njmp, , , "+etiqF+";";
						res = new nodoCondicion(cod);
						res.addFalsa(etiqF);
						res.addVerdadera(etiqV);
						return res;
					}else if(this.esCadena(val1.tipo) && this.esCadena(val2.tipo)){
						var sumaCadena = this.sumarAsciiCadena(val2.valor);
						var suma2 = this.sumarAsciiCadena(val1.valor);
						cod=signo+", "+suma2+", "+sumaCadena+", "+etiqV+";\njmp, , , "+etiqF+";";
						res = new nodoCondicion(cod);
						res.addFalsa(etiqF);
						res.addVerdadera(etiqV);
						return res;
					}else{
						errores.insertarError("Semantico", "No es valido realizar una operacion relacional "+ val1.tipo +", con "+val2.tipo);
						return retNulo;
					}

			}else{
				errores.insertarError("Semantico", "No es valido realizar una operacion relacional con booleanos "+ signo);
				return retNulo;
			}

		}else{
			errores.insertarError("Semantico","No es valido realizar una operacion relacional con nulos, "+ signo);
			return retNulo;
		}

	}else{
		errores.insertarError("Semantico", "Hubo un error al realizar las operaciones para relacional "+signo);
		return retNulo;

	}
};

generacionCodigo.prototype.validarPotenciaOperacion = function(val1, val2){

	var ret; 
	if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
		if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){

			if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
//enteros
			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "^, "+val1.valor+", "+val2.valor+", "+temp+";";
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
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "/, "+val1.valor+", "+val2.valor+", "+temp+";";
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
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			//validacines entero... :D 

			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "*, "+val1.valor+", "+val2.valor+", "+temp+";";
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
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorDecimal(temp);
				return ret;
			}
			//enteros

			else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}
			else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
				this.c3d.addCodigo(cod);
				ret = new EleRetorno();
				ret.setValorEntero(temp);
				return ret;
			}

			else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
				var temp = this.c3d.getTemporal();
				var cod = "-, "+val1.valor+", "+val2.valor+", "+temp+";";
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


generacionCodigo.prototype.concatenarCadenas = function(cad1, cad2){
	if(cad1.tipo.toUpperCase() =="CADENA" && cad2.tipo.toUpperCase() == "CADENA"){
		var temp1= this.c3d.getTemporal();
		var temp2= this.c3d.getTemporal();
		var temp3= this.c3d.getTemporal();
		var temp4= this.c3d.getTemporal();
		var temp5= this.c3d.getTemporal();
		var temp6= this.c3d.getTemporal();
		var temp7= this.c3d.getTemporal();
		var temp8= this.c3d.getTemporal();
		var temp9= this.c3d.getTemporal();
		var temp10= this.c3d.getTemporal();
		var temp11= this.c3d.getTemporal();
		var l1 = "=>, "+cad1.valor+", "+temp1+", heap;";
		var l2 = "=>, "+temp1+", "+temp2+", heap; // size cadena1";
		var l3 = "+, "+temp1+", 1, "+temp3+"; // pos 0 de la cadena 1";

		var l4 = "=>, "+cad2.valor+", "+temp4+", heap;";
		var l5 = "=>, "+temp4+", "+temp5+", heap; // size cadena2";
		var l6 = "+, "+ temp4+", 1, "+temp6+"; // pos 0 de la cadena 2";
		
		var l7 = "+, "+temp2+", "+temp5+", "+temp7+"; // size de la nueva cadena";

		var l8 = "=>, "+temp3+", "+temp8+", heap; // primer caracter de la cadena 1";
		var l9 = "=>, "+temp6+", "+temp9+", heap; // primer caracter de la cadena 2";

		var l10 = "+, H, 0, "+temp10+"; // posicion de retorno de la cadena";
		var l11 = "+, H, 1, "+temp11+";";
		var l12 = "<=, "+temp10+", "+temp11+", heap;";
		var l13 = "+, H, 1, H;";
		var l14 = "<=, H, "+temp7+", heap; //guardo el size de la nueva cadena";
		var l15 = "+, H, 1, H;";
		var etiq1= this.c3d.getEtiqueta();
		var etiq2= this.c3d.getEtiqueta();
		var etiq3= this.c3d.getEtiqueta();
		var etiq4= this.c3d.getEtiqueta();
		var etiq5= this.c3d.getEtiqueta();
		var etiq6= this.c3d.getEtiqueta();

		var l16 = "jmp, , , "+etiq1+";";
		var l17 = etiq1+":";
		var l18 = "jne, "+temp8+", 34, "+etiq2+";";
		var l19 = "jmp, , , "+etiq3+";";
		var l20 = "jmp, , , "+etiq2+";";
		var l21 = etiq2+":";
		var l22 = "<=, H, "+temp8+", heap; //asignando caracter a la nueva cadena de la cadena 1";
		var l23 = "+, H, 1, H;";
		var l24 = "+, "+temp3+", 1, "+temp3+";";
		var l25 = "=>, "+temp3+", "+temp8+", heap;";
		var l26 = "jmp, , , "+etiq1+";";
		var l27 = "jmp, , , "+etiq3+";";
		var l28 = etiq3+":";
		var l29 = "jmp, , , "+etiq4+";";
		var l30 = etiq4+":";
		var l31 = "jne, "+temp9+", 34, "+etiq5+";";
		var l32 = "jmp, , , "+etiq6+";";
		var l33 = "jmp, , , "+etiq5+";";
		var l34 = etiq5+":";
		var l35 = "<=, H, "+temp9+", heap; // ingresando caracter de la cadena 2";
		var l36 = "+, H, 1, H;";
		var l37 = "+, "+temp6+", 1, "+temp6+";";
		var l38 = "=>, "+temp6+", "+temp9+", heap;";
		var l39 = "jmp, , , "+ etiq4+";";
		var l40 = "jmp, , , "+etiq6+";";
		var l41 = etiq6+":";

		this.c3d.addCodigo("//Iniciando a concatnar cadenas ");
		this.c3d.addCodigo(l1);
		this.c3d.addCodigo(l2);
		this.c3d.addCodigo(l3);
		this.c3d.addCodigo(l4);
		this.c3d.addCodigo(l5);
		this.c3d.addCodigo(l6);
		this.c3d.addCodigo(l7);
		this.c3d.addCodigo(l8);
		this.c3d.addCodigo(l9);
		this.c3d.addCodigo(l10);
		this.c3d.addCodigo(l11);
		this.c3d.addCodigo(l12);
		this.c3d.addCodigo(l13);
		this.c3d.addCodigo(l14);
		this.c3d.addCodigo(l15);
		this.c3d.addCodigo(l16);
		this.c3d.addCodigo(l17);
		this.c3d.addCodigo(l18);
		this.c3d.addCodigo(l19);
		this.c3d.addCodigo(l20);
		this.c3d.addCodigo(l21);
		this.c3d.addCodigo(l22);
		this.c3d.addCodigo(l23);
		this.c3d.addCodigo(l24);
		this.c3d.addCodigo(l25);
		this.c3d.addCodigo(l26);
		this.c3d.addCodigo(l27);
		this.c3d.addCodigo(l28);
		this.c3d.addCodigo(l29);
		this.c3d.addCodigo(l30);
		this.c3d.addCodigo(l31);
		this.c3d.addCodigo(l32);
		this.c3d.addCodigo(l33);
		this.c3d.addCodigo(l34);
		this.c3d.addCodigo(l35);
		this.c3d.addCodigo(l36);
		this.c3d.addCodigo(l37);
		this.c3d.addCodigo(l38);
		this.c3d.addCodigo(l39);
		this.c3d.addCodigo(l40);
		this.c3d.addCodigo(l41);
		this.c3d.addCodigo("<=, H, 34, heap; // apuntador final de la cadena");
		this.c3d.addCodigo("+, h, 1, h;");
		var retn = new EleRetorno();
		retn.setValorCadena(temp10);
		return retn;
	}else{
		errores.insertarError("Semantico", "Para concatenar deben ser dos cadenas");
		var ret = new EleRetorno();
					ret.setValoresNulos();
					return ret;
	}


};

generacionCodigo.prototype.validarSumaOperacion= function(val1, val2){

		var ret; 
		//console.dir(val1);
		//console.dir(val2);
		if((val1 instanceof EleRetorno) && (val2 instanceof EleRetorno)){
			if(!this.esNulo(val1.tipo) && !this.esNulo(val2.tipo)){
				
				if(this.esInt(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				} 
				else if(this.esDecimal(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esDecimal(val1.tipo) && this.esChar(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esChar(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esBool(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esDecimal(val1.tipo) && this.esBool(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}
				else if(this.esDecimal(val1.tipo) && this.esDecimal(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorDecimal(temp); 
					return ret;
				}

				//retorno tipo entero

				else if(this.esInt(val1.tipo) && this.esChar(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esChar(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esBool(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esInt(val1.tipo) && this.esBool(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}

				else if(this.esInt(val1.tipo) && this.esInt(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}
				else if(this.esBool(val1.tipo) && this.esBool(val2.tipo)){
					var temp = this.c3d.getTemporal();
					var cod = "+, "+val1.valor+", "+ val2.valor+", "+temp+";";
					this.c3d.addCodigo(cod);
					ret = new EleRetorno();
					ret.setValorEntero(temp);
					return ret;
				}else if(this.esChar(val1.tipo) && this.esChar(val2.tipo)){
					var cad1 = this.convertirCadena(val1);
					var cad2 = this.convertirCadena(val2);
					var r = this.concatenarCadenas(cad1, cad2);
					if(r.tipo.toUpperCase() == "CADENA"){
						return r;
					}else{
						ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}
				}else if(this.esChar(val1.tipo) && this.esCadena(val2.tipo)){
					var cad1 = this.convertirCadena(val1);
					var r = this.concatenarCadenas(cad1, val2);
					if(r.tipo.toUpperCase() == "CADENA"){
						return r;
					}else{
						ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}


				}else if(this.esCadena(val1.tipo) && this.esChar(val2.tipo)){
					var cad2 = this.convertirCadena(val2);
					var r = this.concatenarCadenas(val1, cad2);
					if(r.tipo.toUpperCase() == "CADENA"){
						return r;
					}else{
						ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}

				}else if(this.esCadena(val1.tipo) && this.esCadena(val2.tipo)){
					var r = this.concatenarCadenas(val1, val2);
					if(r.tipo.toUpperCase() == "CADENA"){
						return r;
					}else{
						ret = new EleRetorno();
						ret.setValoresNulos();
						return ret;
					}

				}
				else{
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

generacionCodigo.prototype.esVacio= function(val){
	return (val.toUpperCase() == "NULO2");
};

generacionCodigo.prototype.esCadena = function(val){
	return (val.toUpperCase() == "CADENA");
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

generacionCodigo.prototype.esObjeto = function(tipo){

	if(tipo.toUpperCase() == "ENTERO" ||
	tipo.toUpperCase() == "DECIMAL" ||
	tipo.toUpperCase() == "BOOLEANO" ||
	tipo.toUpperCase() == "CARACTER"){
		return false;
	}

return true;
};






module.exports = generacionCodigo;




