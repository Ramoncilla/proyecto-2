%{
	
	var descripcionLeccion = require("./ArbolLecciones/descripcionLeccion");
    var ejemploLeccion = require("./ArbolLecciones/ejemploLeccion");
    var resultadoLeccion = require("./ArbolLecciones/resultadoLeccion");
    var tareaLeccion = require("./ArbolLecciones/tareaLeccion");
    var tipoLeccion = require("./ArbolLecciones/tipoLeccion");
    var tituloLeccion = require("./ArbolLecciones/titulo");
    var leccion= require("./Leccion");
    var listaLecciones = require("./listaLecciones");
   
%}
%lex

%options case-insensitive

decimal [0-9]+("."[0-9]+)\b 
entero [0-9]+	              
caracter "'"([0-9]|[a-zA-Z])"'" 
id  ([a-zA-Z_])(([a-zA-Z_])|([0-9]))*  
%%

\s+                                   /* IGNORE */
"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */

"<<" return 'abreSentencia'
">>" return 'cierraSentencia'
"a-coach" return 'acoach'
"g-coach" return 'gcoach'
"titulo"     return 'titulo'
"descripcion"       return 'descripcion'
"tipo"                return 'tipo'
"ejemplo"             return 'ejemplo'
"tarea"     return 'tarea'
"resultado"     return 'resultado'
"{%"     return 'abreLeccion'
"%}"     return 'cierraLeccion'
"/="				return 'divIgual'
"/"                   return 'division'
"->" return 'flecha'
"@" return 'arroba'
"," return 'coma'
"{'\0'}" return 'nulo'
"{\"\0\"}"return 'nulo'
"<="                   return 'menorIgual'
">="                   return 'mayorIgual'
"=="                   return 'igualIgual'
"!="                   return 'distintoA'
"<"                   return 'menor'
">"                   return 'mayor'
"."					return 'punto'
"+="                return 'masIgual'
"-="				return 'menosIgual'
"*="				return 'porIgual'
"=" 				return 'igual'
"++"	return 'masMas'
"--" 	return 'menosMenos'	       
"*"                   return 'por'
"-"                   return 'menos'
"+"                   return 'mas'
"^"                   return 'potencia'
"("                   return 'abrePar'
")"                   return 'cierraPar'
"{" 	return 'abrellave'
"}"		return 'cierraLlave'
"["   	return 'abreCor'
"]"     return 'cierraCor'
"||"                   return 'or'
"&&"                   return 'and'
"??"                   return 'xor'
"!"                   return 'not'
";"      			return 'puntoComa'
":"					return 'dosPuntos'
\"(\\.|[^"])*\"			return 'cadena';

{id}   return 'id'
{decimal} return 'decimal'
{entero} return 'entero'
{caracter} return 'caracter'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex


%start ARCHIVO_LECCIONES

%% /* language grammar */

ARCHIVO_LECCIONES : LECCIONES EOF {
	return $1;
	};



	TITULO: titulo abrellave abreSentencia TEXTO  cierraSentencia cierraLlave{$$ = new tituloLeccion($4);};

	DESCRIPCION: descripcion abrellave  abreSentencia TEXTO  cierraSentencia cierraLlave{$$ = new descripcionLeccion($4);};
	
	TAREA: tarea abrellave abreSentencia TEXTO cierraSentencia cierraLlave {$$ = new tareaLeccion($4); };

	RESULTADO: resultado abrellave abreSentencia TEXTO cierraSentencia cierraLlave{$$ = new resultadoLeccion($4); };

	TIPO_LECCION: tipo abrellave abreSentencia tipoLeccion cierraSentencia cierraLlave{$$ = new tipoLeccion($4); };

	EJEMPLO: ejemplo abrellave abreSentencia TEXTO  cierraSentencia cierraLlave{$$ = new ejemploLeccion($4); };

	 
	tipoLeccion: gcoach{$$=$1;}
    	|acoach{$$=$1;};

		LECCIONES: LECCION 
				{
					$$ = [];
					$$.push($1);
					/*$$ =new listaLecciones(); 
					$$.saveLesson($1);*/
				}
			|LECCIONES LECCION
			{
				$$=$1;
				$$.push[$2];
				/*$$= $1;
				$$.saveLesson($2);*/
			};

		LECCION: abreLeccion VALORES_LECCION cierraLeccion {$$= $2;};

		VALORES_LECCION: VALOR_LECCION 
				{
					$$ = new leccion(); 
					$$.insertarValor($1);
				}
			|VALORES_LECCION VALOR_LECCION
			{
				$$ = $1;
				$$.insertarValor($2);
			};

		
		VALOR_LECCION: TITULO{$$=$1;}
			|DESCRIPCION{$$=$1;}
			|TAREA{$$=$1;}
			|RESULTADO{$$=$1;}
			|TIPO_LECCION{$$=$1;}
			|EJEMPLO{$$=$1;}
			|EJEMPLO2{$$=$1;}; 
			


    TEXTO: ELEMENTO_TEXTO {$$ = $1;}
		|TEXTO ELEMENTO_TEXTO {$$ = $1+" "+$2;};

	ELEMENTO_TEXTO: acoach{$$=$1;}
		|gcoach{$$=$1;}
		|titulo{$$=$1;}
		|descripcion{$$=$1;}
		|tipo{$$=$1;}
		|ejemplo{$$=$1;}
		|tarea{$$=$1;}
		|resultado{$$=$1;}
		|abreLeccion{$$=$1;}
		|cierraLeccion{$$=$1;}
		|divIgual{$$=$1;}
		|division{$$=$1;}
		|flecha{$$=$1;}
		|arroba{$$=$1;}
		|coma{$$=$1;}
		|nulo{$$=$1;}
		|menorIgual{$$=$1;}
		|mayorIgual{$$=$1;}
		|igualIgual{$$=$1;}
		|distintoA{$$=$1;}
		|menor{$$=$1;}
		|mayor{$$=$1;}
		|punto{$$=$1;}
		|masIgual{$$=$1;}
		|menosIgual{$$=$1;}
		|porIgual{$$=$1;}
		|igual{$$=$1;}
		|masMas{$$=$1;}
		|menosMenos	{$$=$1;}       
		|por{$$=$1;}
		|menos{$$=$1;}
		|mas{$$=$1;}
		|potencia{$$=$1;}
		|abrePar{$$=$1;}
		|cierraPar{$$=$1;}
		|abrellave{$$=$1;}
		|cierraLlave{$$=$1;}
		|abreCor{$$=$1;}
		|cierraCor{$$=$1;}
		|or{$$=$1;}
		|and{$$=$1;}
		|xor{$$=$1;}
		|not{$$=$1;}
		|puntoComa{$$=$1;}
		|dosPuntos{$$=$1;}
		|cadena{$$=$1;}
		|id{$$=$1;}
		|decimal{$$=$1;}
		|entero{$$=$1;}
		|caracter{$$=$1;};

	