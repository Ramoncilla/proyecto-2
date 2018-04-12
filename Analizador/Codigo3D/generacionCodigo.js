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
						if(atriTemporal.expresionAtributo instanceof Instancia){
							var asInstancia = new AsignacionE();
							asInstancia.setValores(atriTemporal.nombreCorto,"=",atriTemporal.expresionAtributo,2);
							this.escribir3D(asInstancia,ambitos,nombreClase,funTemporal.obtenerFirma());
							//|id igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,2); $$=a;}//2
						}else{
							var temp1 = this.c3d.getTemporal();
							var l1 = "+, p, 0, "+temp1+" //Pos del this del objeto "+ nombreClase;
							var temp2 = this.c3d.getTemporal();
							var l2 = "=>, "+temp1+", "+temp2+", stack // obteniendo el apuntador  del heap ";
							var temp3 = this.c3d.getTemporal();
							var l3 = "=>, "+temp2+", "+temp3+", heap // recupenrado del heap el apuntdor al heap de donde inicia el objeto";
							var temp4 = this.c3d.getTemporal();
							var l4 = "+, "+temp3+", "+atriTemporal.apuntador+", "+temp4+" // obteniendo la posicion real del atributo "+ atriTemporal.nombreCorto;
							var retExpresion = this.resolverExpresion(atriTemporal.expresionAtributo,ambitos,nombreClase, funTemporal.obtenerFirma());
							if(retExpresion instanceof EleRetorno){
								if(retExpresion.tipo.toUpperCase() != "NULO"){
									var l5 = "<=, "+temp4+", "+retExpresion.valor+", heap //guardando en el heap el valor del atributo";
									this.c3d.addCodigo("// Asignando atributo "+ atriTemporal.nombreCorto);
									this.c3d.addCodigo(l1);
									this.c3d.addCodigo(l2);
									this.c3d.addCodigo(l3);
									this.c3d.addCodigo(l4);
									this.c3d.addCodigo(l5);
								}
							}else{
								errores.insertarError("Semantico", "Hubo un error al resolver para "+ atriTemporal.nombreCorto);
							}

						}
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

generacionCodigo.prototype.asignarAtributos = function (nodo, ambito, clase, metodo){

};

generacionCodigo.prototype.escribir3D= function(nodo,ambitos,clase,metodo){

	var nombreSentecia=sentNombre.obtenerNombreSentencia(nodo);	 
	switch(nombreSentecia.toUpperCase()){

		case "ASIGNACION":{

			var tipoAsignacion = nodo.getTipo();
			switch (tipoAsignacion){

				case 1:{
					//id SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($1,$2,$3,1); $$=a;} //1



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

					console.log("CLASE "+ nombreClaseInstanciar + "  No Parametros  "+ noParametros +"  Nombre Clase a  Instancia  "+ nombreClaseInstanciar);
					console.log("Nombre del metodo "+ firmMetodo);
					if(tipoVar.toUpperCase() == nombreClaseInstanciar.toUpperCase() && firmMetodo!=""){
						var sizeClase = this.tablaSimbolos.SizeClase(nombreClaseInstanciar);
						var esAtributo = this.tablaSimbolos.esAtributo(nombreVar,ambitos);
						
						if(esAtributo!=null){
							if(esAtributo){
								// se realizara una instancia de un atributo
								console.log("INSTSNAIAL DE ATRIBUTO");
								var posVar = this.tablaSimbolos.obtenerPosAtributo(nombreVar,ambitos);
								if(posVar!= -1){
									var temp = this.c3d.getTemporal();
									var l1 = "+, p, 0, "+temp+"// pos this de "+nombreVar;
									var temp2 = this.c3d.getTemporal();
									var l2= "=>, "+temp+", "+temp2+", stack //apuntador del heap de "+ nombreVar;
									var temp3 = this.c3d.getTemporal();
									var l3 = "=>, "+temp2+", "+temp3+", heap //posicion real del heap donde inicia "+nombreVar;
									var temp4= this.c3d.getTemporal();
									var l4 ="+, "+temp3+", "+posVar+", "+temp4+" //pos real del atributo "+nombreVar;
									var l5 ="<=, "+temp4+", h, heap //guardando la pos real donde inicia el objeto "+nombreVar;
									var l6 ="+, h, "+sizeClase+", h // reservando el espacio de memoria para el nuevo objeto "+ nombreVar;

									var l7="// Guardando la referencia al this del objeto para la llamada al constructor "+nombreVar;
									var temp5 = this.c3d.getTemporal();
									var l8 = "+, p, 0, "+ temp5;
									var temp6 = this.c3d.getTemporal();
									var l9 = "=>, "+temp5+", "+ temp6+", stack //apuntador al heap de "+ nombreVar;
									var temp7 = this.c3d.getTemporal();
									var l10 = "=>, "+temp6+", "+temp7+", heap //posicion real donde incia el objeto "+nombreVar;
									var temp8 = this.c3d.getTemporal();
									var l11= "+, "+temp7+", "+posVar+", "+ temp8+" // pos real donde incial el objeto "+ nombreVar;
									
									var temp9 = this.c3d.getTemporal();

									var l12 = "+, p, "+temp8+", "+temp9+" // tamanho de la funcion actual "+ metodo;
									var temp10 = this.c3d.getTemporal();
									var l13 = "+, "+temp9+", 0, "+temp10 +" // pos del this para la nueva instancia de "+ nombreVar;
									var l14 = "<=, "+temp10+", "+temp8+", stack //guaradndo el puntero del this en el stack ";
									
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
											var l1_1= "+, p, "+sizeFuncActual+", "+temp1_1+" // size de funcion actual";
											var temp2_1= this.c3d.getTemporal();
											var l2_1= "+, "+temp1_1+", "+cont+", "+temp2_1+" //pos del parametro "+ cont;
											var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
											var l3_1="";
											if(retExpresion.tipo.toUpperCase() != "NULO"){
												l3_1= "<=, ",temp2_1+", "+retExpresion.valor+", stack // asignado al stack el parametro";
												this.c3d.addCodigo(l1_1);
												this.c3d.addCodigo(l2_1);
												this.c3d.addCodigo(l3_1);
											} 
										}

									}else{
										this.c3d.addCodigo("// No posee parametros ");
									}
									
									var l15= "+, p, "+sizeFuncActual+", p // simulando cambio de ambito";
									var l16 = "call, , , "+firmMetodo;
									var l17 = "-, p, "+sizeFuncActual+", p // regresando al ambito acutal";
									

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
									var l1 = "+, p, "+ posVariable+", "+ temp1+" // pos de "+ nombreVar;
									var l2 = "<=, "+temp1+", h, stack //guardando referencia del heap para el objeto "+ nombreVar;
									var temp2 = this.c3d.getTemporal();
									var l3 = "+, h, 1, "+temp2+" // guardo la posicion donde inicia el objeto ";
									var l4 = "<=, h, "+temp2+", heap // guardando donde es que inicia el objeto dentro del heap";
									var l5 = "+, h, 1, h // sumando al heap la posicion que usamos extra para el doble apuntador ";
									var l6 = "+, h, "+sizeClase+", h // reservando espacio para el objeto "+ nombreVar;
									var l7 = "//Ingresando referencia al this del objeto "+ nombreVar;
									var temp3 =this.c3d.getTemporal();
									var l8 = "+, p, "+posVariable+", "+temp3+" // pos de "+nombreVar;
									var temp4 = this.c3d.getTemporal();
									var l9 = "=>, "+temp3+", "+temp4+", stack // obteniendo apuntador de "+ nombreVar;
									var temp5 = this.c3d.getTemporal();
									var l10 = "+, p, "+ sizeFuncActual+", "+ temp5+" // simulando cambio de ambito";
									var temp6 = this.c3d.getTemporal();
									var l6 = "+, "+temp5+", 0, "+temp6+" //pos del this de "+nombreVar;
									var l7 = "<=, "+temp6+", "+temp4+", stack // insertando apuntador del heap al stack del obeto "+ nombreVar;

									this.c3d.addCodigo("// ----------- Instancia a una variable local --------------");
									this.c3d.addCodigo(l1);
									this.c3d.addCodigo(l2);
									this.c3d.addCodigo(l3);
									this.c3d.addCodigo(l4);
									this.c3d.addCodigo(l5);
									this.c3d.addCodigo(l6);
									this.c3d.addCodigo("");
									this.c3d.addCodigo(l7);
									this.c3d.addCodigo("");


									if(noParametros!= 0){
										this.c3d.addCodigo("// Asignando parametros  ");
										var expresionTemporal;
										var cont=1;
										for(var j =0; j< parametrosInstancia.length; j++){
											expresionTemporal = parametrosInstancia[j];
											var temp1_1 = this.c3d.getTemporal();
											var l1_1= "+, p, "+sizeFuncActual+", "+temp1_1+" // size de funcion actual";
											var temp2_1= this.c3d.getTemporal();
											var l2_1= "+, "+temp1_1+", "+cont+", "+temp2_1+" //pos del parametro "+ cont;
											var retExpresion = this.resolverExpresion(expresionTemporal,ambitos,clase,metodo);
											var l3_1="";
											if(retExpresion.tipo.toUpperCase() != "NULO"){
												l3_1= "<=, ",temp2_1+", "+retExpresion.valor+", stack // asignado al stack el parametro";
												this.c3d.addCodigo(l1_1);
												this.c3d.addCodigo(l2_1);
												this.c3d.addCodigo(l3_1);
											} 
										}

									}else{
										this.c3d.addCodigo("// No posee parametros ");
									}

									var l15= "+, p, "+sizeFuncActual+", p // simulando cambio de ambito";
									var l16 = "call, , , "+firmMetodo;
									var l17 = "-, p, "+sizeFuncActual+", p // regresando al ambito acutal";
									

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

	}//fin switch sentencia
};




/*============================================= Validacion de Tipos ============================================ */



/* ================================================ Resolver Expresiones ===================================================== */

generacionCodigo.prototype.resolverInstancia = function(){

};


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




