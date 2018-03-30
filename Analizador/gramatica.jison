
%{
	var Clase = require("./Arbol/Clase");
    var Atributo = require("./Arbol/Atributo.js");
    var Archivo = require("./Arbol/Archivo.js");
    
    var  Acceso = require("./Arbol/Expresion/Acceso.js");
    var Aritmetica = require("./Arbol/Expresion/Aritmetica.js");
    var Booleano = require("./Arbol/Expresion/Booleano.js");
    var Cadena = require("./Arbol/Expresion/Cadena.js");
    var Caracter = require("./Arbol/Expresion/Caracter.js");
    var convertirCadena = require("./Arbol/Expresion/convertirCadena.js");
    var convertirEntero = require("./Arbol/Expresion/convertirEntero.js");
    var Decimal = require("./Arbol/Expresion/Decimal.js");
    var Entero = require("./Arbol/Expresion/Entero.js");
    var Este = require("./Arbol/Expresion/Este.js");
    var FuncionNativa = require("./Arbol/Expresion/FuncionNativa.js");
    var Instancia = require("./Arbol/Expresion/Instancia.js");
    var  Llamada = require("./Arbol/Expresion/Llamada.js");
    var  Logica = require("./Arbol/Expresion/Logica.js");
    var  Negativo = require("./Arbol/Expresion/Negativo.js");
    var  Not_logica= require("./Arbol/Expresion/Not_logica.js");
    var  Nulo= require("./Arbol/Expresion/Nulo.js");
    var  obtenerDireccion= require("./Arbol/Expresion/obtenerDireccion.js");
    var  ObtenerTamanio= require("./Arbol/Expresion/ObtenerTamanio.js");
    var  PosArreglo= require("./Arbol/Expresion/PosArreglo.js");
    var  Relacional= require("./Arbol/Expresion/Relacional.js");
    var  ReservarMemoria= require("./Arbol/Expresion/ReservarMemoria.js");
    var  t_id= require("./Arbol/Expresion/t_id.js");
    var  Unario= require("./Arbol/Expresion/Unario.js");
    var  ValorPuntero= require("./Arbol/Expresion/ValorPuntero.js");


    var  Constructor = require("./Arbol/Funciones/Constructor.js");
    var  Funcion = require("./Arbol/Funciones/Funcion.js");
    var  Parametro = require("./Arbol/Funciones/Parametro.js");
    var  Principal = require("./Arbol/Funciones/Principal.js");

    var Asignacion = require("./Arbol/Sentencias/Asignacion.js");
    var  AsignacionArreglo= require("./Arbol/Sentencias/AsignacionArreglo.js");
    var AsignacionUnario = require("./Arbol/Sentencias/AsignacionUnario.js");
    var AsignaDecla = require("./Arbol/Sentencias/AsignaDecla.js");
    var  Caso= require("./Arbol/Sentencias/Caso.js");
    var  Ciclo_X= require("./Arbol/Sentencias/Ciclo_X.js");
    var Concatenar = require("./Arbol/Sentencias/Concatenar.js");
    var  Contador= require("./Arbol/Sentencias/Contador.js");
    var Continuar = require("./Arbol/Sentencias/Continuar.js");
    var  DeclaArreglo= require("./Arbol/Sentencias/DeclaArreglo.js");
    var  DeclaAsignaPuntero= require("./Arbol/Sentencias/DeclaAsignaPuntero.js");
    var  DeclaCola= require("./Arbol/Sentencias/DeclaCola.js");
    var  DeclaLista= require("./Arbol/Sentencias/DeclaLista.js");
    var DeclaPila = require("./Arbol/Sentencias/DeclaPila.js");
    var  DeclaPuntero = require("./Arbol/Sentencias/DeclaPuntero.js");
    var  DeclaVariable= require("./Arbol/Sentencias/DeclaVariable.js");
    var  destruirPuntero= require("./Arbol/Sentencias/destruirPuntero.js");
    var  Enciclar= require("./Arbol/Sentencias/Enciclar.js");
    var  Estructura= require("./Arbol/Sentencias/Estructura.js");
    var  Hacer_Mientras= require("./Arbol/Sentencias/Hacer_Mientras.js");
    var  Importar= require("./Arbol/Sentencias/Importar.js");
    var  Imprimir= require("./Arbol/Sentencias/Imprimir.js");
    var  Leer_Teclado= require("./Arbol/Sentencias/LeerTeclado.js");
    var  Puntero= require("./Arbol/Sentencias/Puntero.js");
    var  Repetir= require("./Arbol/Sentencias/Repetir.js");
    var  Repetir_Contando= require("./Arbol/Sentencias/Repetir_Contando.js");
    var  Repetir_Mientras= require("./Arbol/Sentencias/Repetir_Mientras.js");
    var  Retorno= require("./Arbol/Sentencias/Retorno.js");
    var  Romper= require("./Arbol/Sentencias/Romper.js");
    var  Selecciona= require("./Arbol/Sentencias/Selecciona.js");
    var  Si= require("./Arbol/Sentencias/Si.js");
   
%}

/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex

%options case-insensitive

decimal [0-9]+("."[0-9]+)\b 
entero [0-9]+	              
caracter "'"([0-9]|[a-zA-Z])"'" 

tamanioArreglo  ((([a-zA-Z_])(([a-zA-Z_])|([0-9]))*)(".")("tamanio")) 
id  ([a-zA-Z_])(([a-zA-Z_])|([0-9]))*  


%%

\s+                   /* skip whitespace */

"crearPuntero" return 'crearPuntero'
"obtenerDireccion" return 'obtenerDireccion'
"reservarMemoria" return 'reservarMemoria'
"consultarTamnio" return 'consultarTamanio'
"->" return 'flecha'
"destruirPuntero" return 'destruirPuntero'

"tamanio" return 'tamanio'
"Repetir_Mientras"  return 'Repetir_Mientras'
"hacer" return 'hacer'
"mientras" return 'mientras'
"Ciclo_doble_condicion" return 'Ciclo_doble_condicion'
"Repetir" return 'Repetir'
"hasta_que" return 'hasta_que'
"Repetir_contando" return 'Repetir_contando'
"variable" return 'variable'
"desde" return 'desde'
"hasta" return 'hasta'
"Enciclar" return 'Enciclar'
"Contador" return 'Contador'
"Leer_Teclado" return 'Leer_Teclado'
"Evaluar_si" return 'Evaluar_si'
"Es_igual_a" return 'Es_igual_a'
"defecto" return 'defecto'

"Es_falso" return 'Es_falso'
"Es_verdadero" return 'Es_verdadero'
"Si" return 'Si'
"Lista"  return 'Lista'
"Pila" return 'Pila'
"Cola" return 'Cola'
"insertar" return 'insertar'
"obtener" return 'obtener'
"buscar" return 'buscar'
"Encolar" return 'Encolar'
"Desencolar" return 'Desencolar'
"importar" 	return 'importar'
"@" return 'arroba'
"Sobreescribir" return 'sobreescribir'
"concatenar"   return 'concatenar'
"," return 'coma'
"convertirAEntero" return 'convertirAEntero'
"convertirACadena" return 'convertirACadena'
"imprimir" return 'imprimir'
"retorno" return 'retorno'
"romper" return 'romper'
"principal"  return 'principal'
"nuevo"  return 'nuevo'
"publico" return 'publico'
"protegido" return 'protegido'
"privado" return 'privado'
"continuar" return 'continuar'
"Nada" return 'nulo'
"{'\0'}" return 'nulo'
"{\"\0\"}"return 'nulo'

"<"                   return 'menor'
">"                   return 'mayor'
"<="                   return 'menorIgual'
">="                   return 'mayorIgual'
"=="                   return 'igualIgual'
"!="                   return 'distintoA'

"hereda_de" return 'hereda_de'
"clase" return 'clase'
"este" return 'este'

"puntero"		return 'puntero'
"vacio" 	return 'vacio'
"true"		      return 'booleano'
"false"               return 'booleano' 
"estructura"	return 'estructura'

"."					return 'punto'
"entero"			return 't_entero'
"caracter"			return 't_caracter'
"booleano"	       return 't_booleano'
"decimal"			return 't_decimal'

"+="                return 'masIgual'
"-="				return 'menosIgual'
"*="				return 'porIgual'
"/="				return 'divIgual'
"=" 				return 'igual'

"++"	return 'masMas'
"--" 	return 'menosMenos'
	       
"*"                   return 'por'
"/"                   return 'division'
"-"                   return 'menos'
"+"                   return 'mas'
"^"                   return 'potencia'

"("                   return 'abrePar'
")"                   return 'cierraPar'

"{" 	return 'abreLlave'
"}"		return 'cierraLlave'

"["   	return 'abreCor'
"]"     return 'cierraCor'

"||"                   return 'or'
"&&"                   return 'and'
"??"                   return 'xor'
"!"                   return 'not'

";"      			return 'puntoComa'
":"					return 'dosPuntos'

//{tamanioArreglo} return 'tamanioArreglo'

\"(\\.|[^"])*\"			return 'cadena';

{id}   return 'id'
{decimal} return 'decimal'
{entero} return 'entero'
{caracter} return 'caracter'


<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */



%start INICIO

%% /* language grammar */


INICIO: ARCHIVO EOF
	{
		var a = new Archivo();
		a.setValores($1);
		console.log("llegue hasta aqui");
		return a;
	};

ARCHIVO: SENT_ARCHIVO 
		{
			var a =[];
			a.push($1);
			$$=a;
		}
	|ARCHIVO SENT_ARCHIVO
		{
			var a = $1;
			a.push($2);
			$$=a;
		};


SENT_ARCHIVO: IMPORTAR{$$=$1;}
	|CLASE{$$=$1;};


IMPORTAR : importar abrePar cadena cierraPar puntoComa
	{
		var a = new Importar();
		a.setValores($3);
		$$=a;
	};

/*-------------------------------- Clases ---------------------------------*/

CLASE: clase id CUERPO_CLASE
		{
			var a = new Clase();
			a.setValores($2,"",$3);
			$$=a;
		}
	| clase id hereda_de id CUERPO_CLASE
		{
			var a = new Clase();
			a.setValores($2,$4,$5);
			$$=a;
		};


CUERPO_CLASE: abreLlave SENTENCIAS_CLASE cierraLlave {$$= $2;}
	|abreLlave cierraLlave {$$=[];};


/*--------------------------- Funciones ----------------------------------*/

SENTENCIAS_CLASE: SENTENCIA_CLASE
		{
			var a = [];
			a.push($1);
			if($1 instanceof Atributo){
			console.log("visiblidad   "+ $1.getVisibilidad());
			}
			$$=a;
		} 
	|SENTENCIAS_CLASE SENTENCIA_CLASE
		{
			var a = $1;
			a.push($2);
			$$=a;
		};


SENTENCIA_CLASE: ATRIBUTO{$$=$1;}
	|FUNCION{$$=$1;}
	|FUNCION_SOBRE{$$=$1;}
	|PRINCIPAL{$$=$1;}
	|CONSTRUCTOR{$$=$1;};


VISIBILIDAD: publico {$$="publico";}
	|protegido{$$="protegido";}
	|privado{$$="privado";};

ATRIBUTO: VISIBILIDAD DECLARACION
		{
			var a = new Atributo();
			a.setValores($1,$2);
			$$=a;
		}
	|DECLARACION
		{
			var a = new Atributo();
			a.setValores("publico",$1);
			console.log(a.getVisibilidad()+"<----");
			$$=a;
		}
	|DECLA_LISTA
		{
			var a = new Atributo();
			a.setValores("publico",$1);
			$$=a;
		}
	|DECLA_PILA
		{
			var a = new Atributo();
			a.setValores("publico",$1);
			$$=a;
		}
	|DECLA_COLA
		{
			var a = new Atributo();
			a.setValores("publico",$1);
			$$=a;
		}
	|ESTRUCTURA
		{
			var a = new Atributo();
			a.setValores("publico",$1);
			$$=a;
		}
	|VISIBILIDAD DECLA_LISTA
		{
			var a = new Atributo();
			a.setValores($1,$2);
			$$=a;
		}
	|VISIBILIDAD DECLA_COLA
		{
			var a = new Atributo();
			a.setValores($1,$2);
			$$=a;
		}
	|VISIBILIDAD DECLA_PILA
		{
			var a = new Atributo();
			a.setValores($1,$2);
			$$=a;
		}
	|VISIBLIDAD ESTRUCTURA
		{
			var a = new Atributo();
			a.setValores($1,$2);
			$$=a;
		}
	|VISIBILIDAD DECLA_PUNTERO
		{
			var a = new Atributo();
			a.setValores($1,$2);
			$$=a;
		}
	|DECLA_PUNTERO
		{
			var a = new Atributo();
			a.setValores("publico",$1);
			$$=a;
		};


FUNCION_SOBRE: arroba sobreescribir FUNCION
	{
		var a = $3;
		a.setSobreEscrita(true);
		$$=a;
	};

FUNCION: VISIBILIDAD TIPO_DECLARACION id  LISTA_PARAMETROS  CUERPO_FUNCION
		{
			var a = new Funcion();
			//function(visib, tipo, nombre,para,sent) 
			a.setValores($1,$2,$3,$4,$5);
			$$=a;
		}
	|VISIBILIDAD vacio id  LISTA_PARAMETROS CUERPO_FUNCION
		{
			var a = new Funcion();
			//function(visib, tipo, nombre,para,sent) 
			a.setValores($1,"vacio",$3,$4,$5);
			$$=a;
		}
	|TIPO_DECLARACION id  LISTA_PARAMETROS  CUERPO_FUNCION
		{
			var a = new Funcion();
			//function(visib, tipo, nombre,para,sent) 
			a.setValores("publico",$1,$2,$3,$4);
			$$=a;
		}
	|vacio id  LISTA_PARAMETROS CUERPO_FUNCION
		{
			var a = new Funcion();
			//function(visib, tipo, nombre,para,sent) 
			a.setValores("publico","vacio",$2,$3,$4);
			$$=a;
		};


PRINCIPAL: principal abrePar cierraPar CUERPO_FUNCION
	{
		var a = new Principal();
		a.setValores($4);
		$$=a;
	};

CONSTRUCTOR: VISIBILIDAD id  LISTA_PARAMETROS  CUERPO_FUNCION
		{
			var a = new Constructor();
			//function(visib, nombre,para,sent) 
			a.setValores($1,$2,$3,$4);
			$$=a;
		}
	|id LISTA_PARAMETROS CUERPO_FUNCION
		{
			var a = new Constructor();
			//function(visib, nombre,para,sent) 
			a.setValores("publico",$1,$2,$3);
			$$=a;
		};
	

LISTA_PARAMETROS : abrePar PARAMETROS cierraPar {$$=$2;}
	|abrePar  cierraPar {$$=[];};


PARAMETRO: TIPO_DECLARACION id 
		{
			var a = new Parametro();
			a.setValores($1,1,$2);
			$$=a;
		}
	|TIPO_DECLARACION puntero id
		{
			var a = new Parametro();
			a.setValores($1,2,$3);
			$$=a;
		}
	|TIPO_DECLARACION id COL_ARREGLO
		{
			var b = new PosArreglo();
			b.setValores($2,$3);
			var a = new Parametro();
			a.setValores($1,1,b);
			$$=a;
		}
	|TIPO_DECLARACION puntero id COL_ARREGLO
		{
			var b = new PosArreglo();
			b.setValores($3,$4);
			var a = new Parametro();
			a.setValores($1,2,b);
			$$=a;
		};

PARAMETROS: PARAMETRO 
		{
			var a = [];
			a.push($1);
			$$=a;
		}
	|PARAMETROS coma PARAMETRO
		{
			var a = $1;
			a.push($3);
			$$=a;
		};


CUERPO_FUNCION: abreLlave SENTENCIAS cierraLlave {$$= $2;}
	| abreLlave cierraLlave {$$= [];};


SENTENCIAS: SENTENCIA
		{
			var a = [];
			a.push($1);
			$$=a;
		}
	|SENTENCIAS SENTENCIA
		{
			var a = $1;
			a.push($2);
			$$=a;
		};
	


SENTENCIA: DECLARACION{$$=$1;}
	|CONCATENAR{$$=$1;}
	|IMPRIMIR{$$=$1;}
	|ROMPER{$$=$1;}
	|RETORNO{$$=$1;}
	|CONTINUAR{$$=$1;}
	|ESTRUCTURA{$$=$1;}
	|DECLA_LISTA{$$=$1;}
	|DECLA_PILA{$$=$1;}
	|DECLA_COLA{$$=$1;}
	|SI{$$=$1;}
	|SWITCH{$$=$1;}
	|REPETIR_MIENTRAS{$$=$1;}
	|HACER_MIENTRAS{$$=$1;}
	|CICLO_X{$$=$1;}
	|REPETIR{$$=$1;}
	|REPETIR_CONTANDO{$$=$1;}
	|ENCICLAR{$$=$1;}
	|CONTADOR{$$=$1;}
	|LEER_TECLADO{$$=$1;}
	|ACCESO puntoComa{$$=$1;}
	|ASIGNACION puntoComa{$$=$1;}
	|DESTRUIR_PUNTERO puntoComa{$$=$1;}
	|DECLA_PUNTERO puntoComa{$$=$1;};


DECLA_LISTA: Lista id igual nuevo Lista abrePar TIPO_DECLARACION cierraPar puntoComa
	{
		var a = new DeclaLista();
		a.setValores($2,$7);
		$$=a;
	};

DECLA_PILA: Pila id igual nuevo Pila abrePar TIPO_DECLARACION cierraPar puntoComa
	{
		var a = new DeclaPila();
		a.setValores($2,$7);
		$$=a;
	};

DECLA_COLA: Cola id igual nuevo Cola abrePar TIPO_DECLARACION cierraPar puntoComa
	{
		var a = new DeclaCola();
		a.setValores($2,$7);
		$$=a;
	};


DECLARACION:  TIPO_DECLARACION id igual EXPRESION puntoComa //1
	{
		var decla = new  DeclaVariable(); decla.setValores($1,$2);
		var asigna = new Asignacion(); asigna.setValores($2,$3,$4,1);
		var asigDec= new AsignaDecla(); asigDec.setValores(decla,asigna,1);
		$$= asigDec;
	}
	|TIPO_DECLARACION id puntoComa 
		{
			var a = new DeclaVariable(); 
			a.setValores($1, $2); 
			$$=a;
		}
	|TIPO_DECLARACION id COL_ARREGLO puntoComa 
		{
			var a = new DeclaArreglo(); 
			a.setValores($1, $2, $3); 
			$$=a;
		}
	|TIPO_DECLARACION id COL_ARREGLO igual EXPRESION puntoComa //2
	{
		var decla = new  DeclaArreglo(); decla.setValores($1,$2, $3);
		var asigna = new AsignacionArreglo(); asigna.setValores($2,$3,$4,$5,7);	
		var asigDec= new AsignaDecla(); asigDec.setValores(decla,asigna,2);
		$$= asigDec;
	}
	|TIPO_DECLARACION id igual INSTANCIA puntoComa//3
	{
		var decla = new  DeclaVariable(); decla.setValores($1,$2);
		var a = new Asignacion(); a.setValores($2,$3,$4,4);	
		var asigDec= new AsignaDecla(); asigDec.setValores(decla,asigna,3);
		$$= asigDec;
	};

ASIGNACION: id SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($1,$2,$3,1); $$=a;} //1
	|id igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,2); $$=a;}//2
	|ACCESO SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($1,$2,$3,3); $$=a;} //3
	|ACCESO igual INSTANCIA { var a = new Asignacion(); a.setValores($1,$2,$3,4); $$=a;}//4
	|id masMas {var a = new AsignacionUnario(); a.setValores($1,"++",5); $$=a; }//5
	|id menosMenos {var a = new AsignacionUnario(); a.setValores($1,"--",5); $$=a; }//5
	|ACCESO masMas {var a = new AsignacionUnario(); a.setValores($1,"++",6); $$=a; }//6
	|ACCESO menosMenos {var a = new AsignacionUnario(); a.setValores($1,"--",6); $$=a; } //6
	|id COL_ARREGLO SIMB_IGUAL EXPRESION {var a = new AsignacionArreglo(); a.setValores($1,$2,$3,$4,7); $$=a;} //7 
	|este punto id SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($3,$4,$5,8); $$=a;}//8
	|este punto id igual INSTANCIA { var a = new Asignacion(); a.setValores($3,$4,$5,9); $$=a;}//9
	|este punto ACCESO SIMB_IGUAL EXPRESION { var a = new Asignacion(); a.setValores($3,$4,$5,10); $$=a;}//10
	|este punto ACCESO igual INSTANCIA { var a = new Asignacion(); a.setValores($3,$4,$5,11); $$=a;}//11
	|este punto id masMas {var a = new AsignacionUnario(); a.setValores($3,"++",12); $$=a; }//12
	|este punto id menosMenos{var a = new AsignacionUnario(); a.setValores($3,"--",12); $$=a; }//12
	|este punto ACCESO masMas{var a = new AsignacionUnario(); a.setValores($3,"++",13); $$=a; }//13
	|este punto ACCESO menosMenos{var a = new AsignacionUnario(); a.setValores($3,"--",13); $$=a; }//13
	|este punto id COL_ARREGLO SIMB_IGUAL EXPRESION{var a = new AsignacionArreglo(); a.setValores($1,$2,$3,$4,14); $$=a;}//14
	|VALOR_PUNTERO igual EXPRESION //15
	{ var a = new Asignacion(); a.setValores($1,$2,$3,15); $$=a;} ;


DECLA_PUNTERO: CREAR_PUNTERO igual EXPRESION
		{
			var a = new DeclaAsignaPuntero();
			a.setValores($1,$3);
			$$=a;
		}

	|CREAR_PUNTERO
		{
			var a = new DeclaPuntero();
			a.setValores($1);
			$$=a;
		};

	
INSTANCIA: nuevo id PARAMETROS_LLAMADA {$$= $3;};

SIMB_IGUAL: igual{$$="=";}
	|masIgual {$$="=+";}
	|menosIgual {$$="=-";}
	|porIgual{$$="=*";}
	|divIgual{$$="=/";};

/*--------------------- Estrucuras de Control -------------------------*/


SI_FALSO: Es_falso CUERPO_FUNCION {$$= $2;};

SI_VERDADERO: Es_verdadero CUERPO_FUNCION{$$= $2;};

SI: Si abrePar EXPRESION cierraPar abreLlave cierraLlave
		{
			var a = [];
			var b = [];
			var c = new Si();
			c.setValores($3,a,b);
			$$=c;
		}
	|Si abrePar EXPRESION cierraPar abreLlave SI_VERDADERO SI_FALSO cierraLlave
		{
			var c = new Si();
			c.setValores($3,$6,$7);
			$$=c;
		}
    |Si abrePar EXPRESION cierraPar abreLlave SI_VERDADERO cierraLlave
    	{
			var b = [];
			var c = new Si();
			c.setValores($3,$6,b);
			$$=c;
		}
    |Si abrePar EXPRESION cierraPar abreLlave SI_FALSO cierraLlave
    	{
			var a = [];
			var c = new Si();
			c.setValores($3,a,$6);
			$$=c;
		}
    |Si abrePar EXPRESION cierraPar abreLlave SI_FALSO SI_VERDADERO cierraLlave
    	{
			var c = new Si();
			c.setValores($3,$7,$6);
			$$=c;
		};


CASO: Es_igual_a EXPRESION dosPuntos  SENTENCIAS
	{
		var a = new Caso();
		a.setValores($2,$4);
		$$=a;
	};

DEFECTO: defecto dosPuntos SENTENCIAS {$$= $3};

LISTA_CASOS: CASO
		{
			console.log("hola1");
			var a = []; 
			a.push($1);
			$$=a;
		}
	|LISTA_CASOS CASO
		{
			console.log("hola");
			var a = $1;
			a.push($2);
			$$=a;

		};


SWITCH: Evaluar_si abrePar EXPRESION cierraPar abreLlave LISTA_CASOS DEFECTO cierraLlave
		{
			var a = new Selecciona();
			a.setValores($3,$6,$7);
			$$=a;
		}
	| Evaluar_si abrePar EXPRESION cierraPar abreLlave LISTA_CASOS cierraLlave
		{
			var a = new Selecciona();
			var c= [];
			a.setValores($3,$6,c);
			$$=a;
		}
	| Evaluar_si abrePar EXPRESION cierraPar abreLlave DEFECTO cierraLlave
		{
			var a = new Selecciona();
			var c= [];
			a.setValores($3,c,$6);
			$$=a;
		}
	| Evaluar_si abrePar EXPRESION cierraPar abreLlave  cierraLlave
		{
			var a = new Selecciona();
			var c= [];
		 	var b = [];
			a.setValores($3,b,c);
			$$=a;
		};


REPETIR_MIENTRAS: Repetir_Mientras abrePar EXPRESION cierraPar CUERPO_FUNCION
	{
		var a = new Repetir_Mientras();
		a.setValores($3,$5);
	};

HACER_MIENTRAS: hacer CUERPO_FUNCION mientras abrePar EXPRESION cierraPar puntoComa
	{
		var a = new Hacer_Mientras();
		a.setValores($2,$5);
		$$=a;	
	};

CICLO_X: Ciclo_doble_condicion abrePar EXPRESION coma EXPRESION cierraPar CUERPO_FUNCION
	{
		var a = new Ciclo_X();
		a.setValores($3,$5,$7);
		$$=a;
	};

REPETIR: Repetir CUERPO_FUNCION hasta_que abrePar EXPRESION cierraPar puntoComa
	{
		var a = new Repetir();
		a.setValores($2,$5);
		$$=a;
	};

REPETIR_CONTANDO: Repetir_contando abrePar variable dosPuntos id puntoComa desde dosPuntos EXPRESION puntoComa hasta dosPuntos EXPRESION cierraPar
CUERPO_FUNCION
	{
		var a = new DeclaVariable();
		a.setValores("entero",$5);
		var rep = new Repetir_Contando();
		rep.setValores(a,$9, $13,$15);
		$$= rep;	
	};


ENCICLAR: Enciclar id CUERPO_FUNCION
	{
		var a = new Enciclar();
		a.setValores($2,$3);
		$$=a;
	};

CONTADOR: Contador abrePar EXPRESION cierraPar CUERPO_FUNCION
	{
		var a = new Contador();
		a.setValores($3,$5);
		$$=a;
	};

LEER_TECLADO: Leer_Teclado abrePar EXPRESION coma id cierraPar puntoComa
	{
		var a = new LeerTeclado();
		a.setValores($3,$5);
		$$=a;
	};


COL_ARREGLO: abreCor EXPRESION cierraCor{var a = []; a.push($2); $$=a;}
	| COL_ARREGLO abreCor EXPRESION cierraCor{var a =$1; a.push($3); $$=a;};	



CONCATENAR:	concatenar abrePar id coma EXPRESION coma EXPRESION cierraPar puntoComa 
		{
			var a = new Concatenar();
			a.setValores($3,$5,$7,1);
			$$=a;
		}
	|concatenar abrePar id coma EXPRESION cierraPar puntoComa //2
		{
			var a = new Concatenar();
			a.setValores($3,$5,null,2);
			$$=a;
		};


IMPRIMIR: imprimir abrePar EXPRESION cierraPar puntoComa
	{
		var a = new Imprimir();
		a.setExpresion($3);
		$$=a;
	};


RETORNO: retorno EXPRESION puntoComa
	{
		var a = new Retorno();
		a.setExpresion($2);
		$$=a;
	}
	|retorno puntoComa
	{
		var a = new Retorno();
		a.setExpresion(null);
		$$=a;
	};


ROMPER: romper puntoComa{ $$ = new Romper();};

CONTINUAR: continuar puntoComa{$$ = new Continuar();};


ESTRUCTURA: estructura id abreCor LISTA_DECLARACIONES cierraCor puntoComa
{
	var a = new Estructura();
	a.setValores($2,$4);
 	$$=a;
};


LISTA_DECLARACIONES: DECLARACION {var a = []; a.push($1); $$= a;}
	|LISTA_DECLARACIONES DECLARACION{var a = $1; a.push($2); $$=a;};


TIPO_DECLARACION: t_entero{$$="entero";}
	|t_caracter{$$="caracter";}
	|t_decimal{$$="decimal";}
	|t_booleano{$$="booleano";}
	|id{$$=$1;};


/*--------------------------- Expresion ----------------------------------*/


EXPRESION: LOGICA{$$=$1;};

LOGICA: LOGICA or XOR{var a = new Logica(); a.setValores($1,$3,"||"); $$=a;}
	|XOR{$$=$1;};

XOR: XOR xor AND {var a = new Logica(); a.setValores($1,$3,"??"); $$=a;}
	|AND{$$=$1;};

AND: AND and NOT {var a = new Logica(); a.setValores($1,$3,"&&"); $$=a;}
	|NOT{$$=$1;};

NOT: not REL{ var a = new Not_logica(); a.setExpresion($2); $$= a;}
	|REL{$$=$1;};


REL: ARITMETICA SIMB_REL ARITMETICA {var a = new Relacional(); a.setValores($1,$3,$2); $$= a;}
	|ARITMETICA{$$=$1;};

SIMB_REL: menor{$$="<";}
	|mayor{$$=">";}
	|menorIgual{$$="<=";}
	|mayorIgual{$$=">=";}
	|distintoA{$$="!=";}
	|igualIgual{$$="==";};

ARITMETICA: ARITMETICA mas MUL{var a = new Aritmetica(); a.setValores($1,$3,"+"); $$=a;}
	|ARITMETICA menos MUL {var a = new Aritmetica(); a.setValores($1,$3,"-"); $$=a;}
	|MUL{$$=$1;};

MUL: MUL por POT{var a = new Aritmetica(); a.setValores($1,$3,"*"); $$=a;}
	|MUL division POT{var a = new Aritmetica(); a.setValores($1,$3,"/"); $$=a;}
	|POT{$$=$1;};

POT: UNARIO potencia POT {var a = new Aritmetica(); a.setValores($1,$3,"^"); $$=a;}
	|UNARIO{$$=$1;};


UNARIO: NEG masMas {var a = new Unario(); a.setValores($1,"++"); $$=a;}
	|NEG menosMenos {var a = new Unario(); a.setValores($1,"--"); $$=a;}
	|NEG{$$=$1;};	

NEG: menos VALOR { var a = new Negativo(); a.setExpresion($2); $$=a;}
	|VALOR{$$=$1;};


VALOR: entero{var num = new Entero(); num.setNumero($1); $$= num;}
	|decimal{var num = new Decimal(); num.setNumero($1); $$=num;}
	|caracter{var car= new Caracter(); car.setValorCaracter($1); $$=car;}
	|booleano{var bol= new Booleano(); bol.setValorBooleano($1); $$=bol;}
	|abrePar EXPRESION cierraPar{ $$=$1;}
	|cadena {var n = new Cadena(); n.setCadena($1); $$=n;}
	|nulo {var n = new Nulo(); n.setNulo(); $$=n;}
	|CONVERTIR_CADENA{$$=S1;}
	|CONVERTIR_ENTERO{$$=$1;}
	|id {console.log($1); var idNuevo = new t_id(); idNuevo.setValorId($1); $$= idNuevo;}
	|id COL_ARREGLO{var i = new PosArreglo(); i.setValores($1, $2); $$=i;}
	|id PARAMETROS_LLAMADA {var i = new Llamada(); i.setValoresLlamada($1, $2); $$= i; console.log(i.getNombreFuncion()); console.log(i.getParametros());}
	|ACCESO {$$=$1;}
	|ESTE {$$=$1;}
	|CUERPO_ARREGLO{$$=$1;}
	|OBTENER_DIRECCION{$$=$1;}
	|RESERVAR_MEMORIA{$$=$1;}
	|OBTENER_TAMANIO{$$=$1;}
	|VALOR_PUNTERO{$$=$1;};





ACCESO: id punto ATRI
		{
			var b = new t_id();
			b.setValorId($1);	
			var a = new Acceso();
			a.setValores(b,$3);
			$$=a;
		}
	|id COL_ARREGLO punto ATRI
		{
			var a = new PosArreglo();
			a.setValores($1,$2);
			var b = new Acceso();
			b.setValores(a,$4);
			$$=b;
		}
	|id PARAMETROS_LLAMADA punto  ATRI
		{
			var a = new Llamada();
			a.setValoresLlamada($1,$2);
			var b = new Acceso();
			b.setValores(a,$4);
			$$=b;
		};

ESTE:este punto ACCESO 
		{
			var a = new Este();
			a.setValores($3);
			$$=a;
		}
	|este punto id
		{
			var a = new t_id();
			a.setValorId($3);
			var b = new Este();
			b.setValores(a);
			$$=b;
		}

	|este punto id COL_ARREGLO
		{
			var a = new PosArreglo();
			a.setValores($3,$4);
			var b = new Este();
			b.setValores(a);
			$$=b;
		}
	|este punto id PARAMETROS_LLAMADA
		{
			var a = new Llamada();
			a.setValoresLlamada($3,$4);
			var b= new Este();
			b.setValores(a);
			$$=b;
		};



ATRI_:id
		{
			var a = new t_id();
			a.setValorId($1);
			$$=a;
		}
	|id COL_ARREGLO
		{
			var a = new PosArreglo();
			a.setValores($1,$2);
			$$=a;
		}
	|id PARAMETROS_LLAMADA
		{
			var a = new Llamada();
			a.setValoresLlamada($1,$2);
			$$=a;
		}
	|insertar abrePar EXPRESION cierraPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|Apilar abrePar EXPRESION cierraPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|Desapilar abrePar cierrPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|Encolar abrePar EXPRESION cierraPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|Desencolar abrePar cierraPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|obtener abrePar EXPRESION cierraPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|buscar abrePar EXPRESION cierraPar
		{
			var a = new FuncionNativa();
			a.setValores($1, $3);
			$$=a;
		}
	|tamanio
		{
			var a = new FuncionNativa();
			a.setValores($1, null);
			$$=a;
		};
	

ATRI: ATRI_
		{
			var a = [];
			a.push($1);
			$$=a;

		} 
	|ATRI punto ATRI_
		{
			var a = $1;
			a.push($3);
			$$=a;

		};


LISTA_EXPRESIONES: EXPRESION { var arreglo = []; var g= arreglo.push($1); console.log("size "+ g); $$= arreglo;}
	|LISTA_EXPRESIONES coma EXPRESION{var arreglo = $1; var g= arreglo.push($3); console.log("size "+ g);; $$= arreglo;};
}


PARAMETROS_LLAMADA : abrePar cierraPar{$$= [];}
	|abrePar LISTA_EXPRESIONES cierraPar{$$=$2; console.log($2);};
}


CUERPO_ARREGLO: abreLlave LISTA_CUERPO_ARREGLO cierraLlave{$$=$2;};


LISTA_CUERPO_ARREGLO: ELEMENTO_FILA{var arreglo = []; arreglo.push($1); $$= arreglo;}
	|LISTA_CUERPO_ARREGLO coma ELEMENTO_FILA{var arreglo= $1; arreglo.push($3); $$=arreglo;};
}


ELEMENTO_FILA : abreLlave LISTA_EXPRESIONES cierraLlave{$$= $2;};
	

CONVERTIR_A_CADENA: convertirACadena abrePar EXPRESION cierraPar puntoComa{var a = new convertirCadena(); a.setExpresionCadena($3); $$= a;};

CONVERTIR_A_ENTERO: convertirAEntero abrePar EXPRESION cierraPar puntoComa{var a = new convertirEntero(); a.setExpresionEntero($3); $$=a;};


/*--------------------- Punteros ------------------------*/



CREAR_PUNTERO: crearPuntero abrePar TIPO_DECLARACION coma id cierraPar //apunta nulo
	{
		var a = new Puntero();
		a.setValores($3,$5);
		$$=a;
	};


OBTENER_DIRECCION: obtenerDireccion abrePar id cierraPar
	{
		var a = new obtenerDireccion();
		a.setValores($3);
		$$=a;
	
	};

RESERVAR_MEMORIA: reservarMemoria abrePar EXPRESION cierraPar

	{
		var a = new ReservarMemoria();
		a.setValores($3);
		$$=a;
	}; 

OBTENER_TAMANIO: consultarTamanio abrePar EXPRESION cierraPar
	{
		var a = new ObtenerTamanio();
		a.setValores($3);
		$$=a;
	
	};


VALOR_PUNTERO: id flecha COMPLE_PUNTERO
	{
		var a = new ValorPuntero();
		a.setValores($1,$3);
		$$=a;
	};

COMPLE_PUNTERO: id 
		{
			var a = [];
			a.push($1);
			$$=a;
		}
	|COMPLE_PUNTERO flecha id
		{
			var a = $1;
			a.push($3);
			$$=a;
		};
	


DESTRUIR_PUNTERO: destruirPuntero abrePar id cierraPar
	{
		var a = new destruirPuntero();
		a.setValores($3);
		$$=a;
	
	};





