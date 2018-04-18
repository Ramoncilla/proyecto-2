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

"begin"     return 'begin'
"end"       return 'end'
"heap"                return 'heap'
"stack"             return 'stack'
"print"     return 'print'
"("     return 'abrePar'
")"     return 'cierrPar'
"<="                  return 'entra'
"=>"                return 'sale'
"\"%c\""    return 'impre_char'
"\"%d\""    return 'impre_entero'
"\"%f\""    return 'impre_decimal'
"="         return 'igual'
"je"        return 'je'
"jne"       return 'jne'
"jg"        return 'jg'
"jge"       return 'jge'
"jl"        return 'ji'
"jle"       return 'jle'
"jmp"       return 'jmp'
"*"                   return 'por'
"/"                   return 'div'
"-"                   return 'menos'
"+"                   return 'suma'
"^"                   return 'pot'
","                    return 'coma'
";"                 return 'puntoComa'
"call"              return 'call'
{id}        return 'id'

<<EOF>>               return 'EOF'
.                     return 'INVALID'


/lex


%start OPERACIONES

%% /* language grammar */


OPERACIONES: FUNCIONES EOF{console.log("llegue"); return $1;};


FUNCIONES: FUNCION{$$ = []; $$.push($1);}
    |FUNCIONES FUNCION{$$= $1; $$.push($2);};

FUNCION: begin coma coma coma id INSTRUCCIONES end coma coma id{$$ = new funcion($5,$6);}
    |begin coma coma coma id end coma coma id{$$ = new funcion($5,[]);};


INSTRUCCIONES: INSTRUCCION puntoComa{$$=[]; $$.push($1);}
    |INSTRUCCIONES INSTRUCCION puntoComa{$$ = $1; $$.push($2);};

INSTRUCCION: EXP {$$=$1;}  
    |ASIG_ED{$$=$1;}
    |GET_ED{$$=$1;}
    |ASIG{$$=$1;}
    |LLAMADA{$$=$1;}
    |IMPRIMIR{$$=$1;}
    |RELACIONAL{$$=$1;}
    |ETIQUETA{$$=$1;}
    |SALTO{$$=$1;};

TIPO: impre_char{$$=$1;}
    |impre_decimal{$$=$1;}
    |impre_entero{$$=$1;};


IMPRIMIR: print abrePar TIPO coma VAL cierrPar{$$= new imprimir($3,$5);};

LLAMADA: call coma coma coma id{$$ = new llamada($5);};

/* ---------------- Asignaciones y obtener del Heap y Stack -------------*/


ASIG_ED: sale coma VAL coma VAL coma TIPO_ED{$$= new edd(2,$3,$5,$7);};

GET_ED: entra coma VAL coma VAL coma TIPO_ED{$$= new edd(1,$3,$5,$7);};


TIPO_ED: stack{$$=0;}
    |heap{$$=1;};


OPE_ARITMETICO: suma {$$="+";}   
    |menos{$$="-";}   
    |por{$$="*";}   
    |div{$$="/";}   
    |pot{$$="^";};

OPE_RELACIONAL: je{$$="==";}   
    |jne{$$="!=";}   
    |jg{$$=">";}   
    |jge{$$=">=";}   
    |jl{$$="<";}   
    |jle{$$="<=";};

RELACIONAL : OPE_RELACIONAL coma VAL coma VAL coma id puntoComa jmp coma coma coma id puntoComa{$$=new relacional($1,$3,$5,$7,$13);};

SALTO: jmp coma coma coma id puntoComa{$$ = new Salto($5);};

ETIQUETA: id dosPuntos{$$= new etiqueta($);};


ASIG : igual coma VAL coma VAL coma VAL{$$ = new Asig($3,$5,$7);};


EXP: OPE_ARITMETICO coma VAL coma VAL coma VAL{$$= new Aritmetica($1,$3,$5,$7);};


VAL: NEGATIVO{$$ = new valor("negativo",$1);}
    |id {$$ = new valor("id",$1);}
    |entero {$$ = new valor("entero",$1);}
    |decimal{$$= new valor("decimal",$1);}
    |{$$= new valor("vacio","");};

NEGATIVO : menos id 
        {
            $$ = new valor("id", $2);
        }
    |menos entero
        {
            $$ = new valor("entero", $2);
        }
    |menos decimal
        {
           $$ = new valor("decimal", $2);
        };






