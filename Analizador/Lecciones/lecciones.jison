%{
	
	var valor = require("./ArbolInterprete/valor");
    var Aritmetica = require("./ArbolInterprete/Aritmetica");
    var Asig = require("./ArbolInterprete/Asig");
    var etiqueta = require("./ArbolInterprete/Etiqueta");
    var Salto = require("./ArbolInterprete/Salto");
    var relacional = require("./ArbolInterprete/Relacional");
    var edd = require("./ArbolInterprete/Get_Asig_ED");
    var llamada = require("./ArbolInterprete/Llamada");
    var imprimir = require("./ArbolInterprete/Imprimir");
    var funcion = require("./ArbolInterprete/Funcion");
    var inicioFuncion = require("./ArbolInterprete/InicioFuncion");
    var finFuncion = require("./ArbolInterprete/FinalFuncion");
   
%}
%lex

%options case-insensitive

id  ([a-zA-Z_])(([a-zA-Z_])|([0-9]))*  

%%
\s+                                   /* IGNORE */
"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */

[0-9]+("."[0-9]+)\b   return 'decimal'
[0-9]+  return 'entero'
\"(\\.|[^"])*\"			return 'cadena'
"a-coach" return 'acoach'
"g-coach" return 'gcoach'
"titulo"     return 'titulo'
"descripcionE"       return 'descripcionE'
"tipo"                return 'tipo'
"ejemplo"             return 'ejemplo'
"descripciont"     return 'descripciont'
"resultado"     return 'resultado'
"{%"     return 'abreLeccion'
"%}"     return 'cierraLeccion'
"{"     return 'abrellave'
"}"                  return 'cierraLlave'
{id}        return 'id'

<<EOF>>               return 'EOF'
.                     return 'INVALID'


/lex


%start LECCIONES

%% /* language grammar */


LECCIONES: LECCION
    |LECCIONES LECCION;


LECCION: abreLeccion VALORES_LECCION cierraLeccion;

VALORES_LECCION: VALOR
    |VALORES_LECCION VALOR;


VALOR: titulo abrellave cadena cierraLlave
    |descripcionE abrellave cadena cierraLlave
    |tipo abrellave tipoLeccion cierraLlave
    |ejemplo abrellave cadena cierraLlave
    |descripciont abrellave cadena cierraLlave
    |resultado abrellave cadena cierraLlave;

tipoLeccion:= gcoach
    |acoach;

