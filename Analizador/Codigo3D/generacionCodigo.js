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
			for(var j = 0; j< claseTemporal.principal_met.sentencias.length; j++){
				sentTemporal = claseTemporal.principal_met.sentencias[j];
				this.escribir3D(sentTemporal, ambitos, nombreClase, nombreAmb);
			}
			this.c3d.addCodigo("");
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
						/*if(atriTemporal.expresionAtributo instanceof Instancia){
							var asInstancia = new AsignacionE();
							asInstancia.setValores(atriTemporal.nombreCorto,"=",atriTemporal.expresionAtributo,2);
							this.escribir3D(asInstancia,ambitos,nombreClase,funTemporal.obtenerFirma());
							//|id igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,2); $$=a;}//2
						}else{
							var temp1 = this.c3d.getTemporal();
							var l1 = "+, p, 0, "+temp1+"; //Pos del this del objeto "+ nombreClase;
							var temp2 = this.c3d.getTemporal();
							var l2 = "=>, "+temp1+", "+temp2+", stack; // obteniendo el apuntador  del heap ";
							var temp3 = this.c3d.getTemporal();
							var l3 = "=>, "+temp2+", "+temp3+", heap;// recupenrado del heap el apuntdor al heap de donde inicia el objeto";
							var temp4 = this.c3d.getTemporal();
							var l4 = "+, "+temp3+", "+atriTemporal.apuntador+", "+temp4+"; // obteniendo la posicion real del atributo "+ atriTemporal.nombreCorto;
							this.c3d.addCodigo("// Asignando atributo "+ atriTemporal.nombreCorto);
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							var retExpresion = this.resolverExpresion(atriTemporal.expresionAtributo,ambitos,nombreClase, funTemporal.obtenerFirma());
							if(retExpresion instanceof EleRetorno){
								if(retExpresion.tipo.toUpperCase() != "NULO"){
									var l5 = "<=, "+temp4+", "+retExpresion.valor+", heap; //guardando en el heap el valor del atributo";
									this.c3d.addCodigo(l5);
								}
							}else{
								errores.insertarError("Semantico", "Hubo un error al resolver para "+ atriTemporal.nombreCorto);
							}

						}*/
					}

				}


			}
			for(var k =0; k<funTemporal.sentencias.length; k++){
				sentTemporal = funTemporal.sentencias[k];
				this.escribir3D(sentTemporal,ambitos,nombreClase,funTemporal.obtenerFirma());
			}
			this.c3d.addCodigo("");
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
	a.Ejecutar3D(this.c3d.codigo3D,"persona_PRINCIPAL");
	console.log("Impresion");
	console.log(a.cadenaImpresion);
	fs.writeFileSync('./Heap.html', a.imprimirHeap());
	fs.writeFileSync('./Stack.html', a.imprimirStack());
	fs.writeFileSync('./temporales.html',a.temporales.imprimirHTML());

    //interprete.parse(this.c3d.codigo3D);
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
	console.dir(nodo);	 
	switch(nombreSentecia.toUpperCase()){
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
				var apuntadorArreglo = this.obtenerApuntadorPosArreglo(nombreArreglo,posicionesArreglo,ambitos,clase,metodo);
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
						var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombre,ambitos);
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
					if(esAtributo!= null){
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
									var retExpresion = this.resolverExpresion(expresionVar,ambitos,clase,metodo);
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

									var l12 = "+, p, "+temp8+", "+temp9+"; // tamanho de la funcion actual "+ metodo;
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
											var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
											var l3_1="";
											this.c3d.addCodigo(l1_1);
											this.c3d.addCodigo(l2_1);
											if(retExpresion.tipo.toUpperCase() != "NULO"){
												l3_1= "<=, ",temp2_1+", "+retExpresion.valor+", stack; // asignado al stack el parametro";
												
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


					break;
				}

				case 4:{
					//|ACCESO igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,4); $$=a;}//4

					break;
				}

				case 8:{
					//|este punto id SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($3,$4,$5,8); $$=a;}//8


					break;
				}

				case 9:{
					//|este punto id igual INSTANCIA { var a = new Asignacion(); a.setValores($3,$4,$5,9); $$=a;}//9

					break;
				}

				case 10:{

					//|este punto ACCESO SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($3,$4,$5,10); $$=a;}//10

					break;
				}

				case 11:{
					//|este punto ACCESO igual INSTANCIA { var a = new Asignacion(); a.setValores($3,$4,$5,11); $$=a;}//11

					break;
				}

				case 15:{
					//|VALOR_PUNTERO igual EXPRESION //15 { var a = new Asignacion(); a.setValores($1,$2,$3,15); $$=a;} ;

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

					}
				}

			}else{
				errores.insertarError("Ha ocurrido un error al resolver para imprimir");
			}
			break;
		}// fin de imprimir



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

	}//fin switch sentencia
};

/* ---------------------------------------------- Acciones de ASignaciones ------------------------------------------------- */

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


generacionCodigo.prototype.obtenerApuntadorPosArreglo = function(nombreArreglo, posicionesArreglo, ambitos, clase, metodo){
		var ret2 = new EleRetorno();
		ret2.setValoresNulos();
		var esAtributo = this.tablaSimbolos.esAtributo(nombreArreglo, ambitos);
		var tipoArreglo= this.tablaSimbolos.obtenerTipo(nombreArreglo,ambitos);
		if(esAtributo!= null){
			var simb= this.tablaSimbolos.obtenerSimbolo(nombreArreglo,ambitos,esAtributo);
			if(simb!=null){
				if(simb.tipoSimbolo.toUpperCase() == "ARREGLO"){
					if(esAtributo){
						//arreglo atributo
						var posArreglo = this.tablaSimbolos.obtenerPosAtributo(nombreArreglo, ambitos);
						if(posArreglo!=-1){
							var temp1 = this.c3d.getTemporal();
							var temp2 = this.c3d.getTemporal();
							var temp3 = this.c3d.getTemporal();
							var temp4 = this.c3d.getTemporal();
							var temp5 = this.c3d.getTemporal();
							var temp6 = this.c3d.getTemporal();
							var temp7 = this.c3d.getTemporal();
							var l1 = "+, P, 0, "+temp1+"; // pos this del objeto ";
							var l2 = "=>, "+temp1+", "+temp2+", stack; // apunt del heap para le objeto";
							var l3 = "=>, "+temp2+", "+temp3+", heap; // apunt donde inicia el objeto";
							var l4 = "+, "+temp3+", "+posArreglo+", "+temp4+"; // pos del arreglo dentro del heap ";
							var l5 = "=>, "+temp4+", "+temp5+", heap; // apuntador donde inicia el arreglo";
							var l6 = "=>, "+temp5+", "+temp6+", heap; // size del arreglo "+ nombreArreglo;
							var l7 = "+, "+temp5+", 1, "+temp7+"; //pos 0 del arreglo "+ nombreArreglo;
							this.c3d.addCodigo("//------------- Asignancio posicion de un arreglo Atributo  "+nombreArreglo);
							this.c3d.addCodigo(l1);
							this.c3d.addCodigo(l2);
							this.c3d.addCodigo(l3);
							this.c3d.addCodigo(l4);
							this.c3d.addCodigo(l5);
							this.c3d.addCodigo(l6);
							this.c3d.addCodigo(l7);
							var tamanios = this.calculoArregloNs(posicionesArreglo,ambitos,clase,metodo);
							var tamanios2 = simb.arregloNs;
							this.c3d.addCodigo("// ----------- Calculo de iReal para el arreglo "+ nombreArreglo);

							if(tamanios.length == posicionesArreglo.length && (tamanios2.length == tamanios.length)){
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

							}//fin de la verificacion ue sena el mismo numero de columnas
							else{
								errores.insertarError("Semantico", "No coiciden el numero de columnas ocn las que se definio "+nombreArreglo);
								return ret2;
							}
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
							if(tamanios.length == posicionesArreglo.length && (tamanios2.length == tamanios.length)){
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
							}else{
								errores.insertarError("Semantico", "No coincide el numero de valores para resolver arreglo");
								return ret2;
							}
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




/* ================================================ Resolver Expresiones ===================================================== */



generacionCodigo.prototype.resolverExpresion = function(nodo, ambitos, clase, metodo) {
	console.dir(nodo);

	var nombreSentecia = sentNombre.obtenerNombreExpresion(nodo).toUpperCase();
	//console.log("Expresion "+ nombreSentecia);
	
	switch(nombreSentecia){

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
			this.c3d.addCodigo(l0);
			this.c3d.addCodigo(l00);
			this.c3d.addCodigo(l1);
			this.c3d.addCodigo(l2);
			this.c3d.addCodigo(l3);
			this.c3d.addCodigo(l4);
			this.c3d.addCodigo(l5);
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
			var apuntadorArreglo = this.obtenerApuntadorPosArreglo(nombreArreglo,posicionesArreglo,ambitos,clase,metodo);
			if(apuntadorArreglo.tipo.toUpperCase() != "NULO"){
				var temp2_5 = this.c3d.getTemporal();
				var l2_5= "=>, "+apuntadorArreglo.valor+", "+temp2_5+", heap; //valor que trae el objeto";
				this.c3d.addCodigo(l2_5);
				var retornVal = new EleRetorno();
				retornVal.tipo = tipoArreglo;
				retornVal.valor = temp2_5;
				return retornVal;
			}
				var ret2 = new EleRetorno();
				ret2.setValoresNulos();
				return ret2;
				break;
			
		}//fin pos_arreglo


	}//fin switch
	 
	
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
		console.dir(val1);
		console.dir(val2);
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






module.exports = generacionCodigo;




