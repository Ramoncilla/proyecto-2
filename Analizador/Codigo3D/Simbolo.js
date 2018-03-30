
function Simbolo(){
	this.visibilidad="noTiene";
	this.nombreCorto ="";
	this.tipoSimbolo="";//arreglo, puntero, var , obj, edd
	this.tipoElemento="";//entero, persona, char, dcimal
	this.ambito=""; //persona1_entero_metodoBonito_decimal_if1
	this.rol=""; //variable local, parametro, retorno, atributo, clase, metodo
	this.apuntador=-1;
	this.tamanio=0;//tamanho de una clase o de un metodo
	this.dimensiones =[]; //nodo de las las dimensines de un arreglo
    this.noParametros =-1; 
    this.parametrosFuncionCadena="";//ENTERO_CARACTER_OBJ
    this.nombreFuncion="";
    this.expresionAtributo=null;//pubico entero a =5;	
    this.noDimensiones=0;
}
 

 	Simbolo.prototype.visibilidad="noTiene";
	Simbolo.prototype.nombreCorto ="";
	Simbolo.prototype.tipoSimbolo="";//arreglo, puntero, var , obj, edd
	Simbolo.prototype.tipoElemento="";//entero, persona, char, dcimal
	Simbolo.prototype.ambito=""; //persona1_entero_metodoBonito_decimal_if1
	Simbolo.prototype.rol=""; //variable local, parametro, retorno, atributo, clase, metodo
	Simbolo.prototype.apuntador=-1;
	Simbolo.prototype.tamanio=0;//tamanho de una clase o de un metodo
	Simbolo.prototype.dimensiones =[]; //nodo de las las dimensines de un arreglo
    Simbolo.prototype.noParametros =-1; 
    Simbolo.prototype.parametrosFuncionCadena="";//ENTERO_CARACTER_OBJ
    Simbolo.prototype.nombreFuncion="";
    Simbolo.prototype.expresionAtributo=null;//pubico entero a =5;
    Simbolo.prototype.noDimensiones=0;

 
 Simbolo.prototype.setVisibilidad = function(vis) {
 	// body...
 	Simbolo.prototype.visibilidad=vis;
 };

 Simbolo.prototype.setExpresionAtributo = function(exp) {
 	// body...
 	Simbolo.prototype.expresionAtributo=exp;
 };
 
 
 Simbolo.prototype.setValoresVariable = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
 	 Simbolo.prototype.nombreCorto= nombreC;
 	 Simbolo.prototype.tipoSimbolo= tipoSimb;
 	 Simbolo.prototype.tipoElemento= tipoElemento;
 	 Simbolo.prototype.ambito= ambito;
 	 Simbolo.prototype.rol = rol;
 	 Simbolo.prototype.apuntador= apu;
 	 Simbolo.prototype.tamanio=size;

 };


 Simbolo.prototype.setValoresArreglo = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size, noDimensiones, listaDim) {
     Simbolo.prototype.nombreCorto = nombreC;
     Simbolo.prototype.tipoSimbolo= tipoSimb;
     Simbolo.prototype.tipoElemento= tipoElemento;
     Simbolo.prototype.ambito= ambito;
     Simbolo.prototype.rol = rol;
     Simbolo.prototype.apuntador= apu;
     Simbolo.prototype.tamanio = size;
     Simbolo.prototype.noDimensiones= noDimensiones;
     Simbolo.prototype.dimensiones = listaDim;

 };


Simbolo.prototype.setValoresLista = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    Simbolo.prototype.nombreCorto= nombreC;
     Simbolo.prototype.tipoSimbolo= tipoSimb;
     Simbolo.prototype.tipoElemento= tipoElemento;
     Simbolo.prototype.ambito= ambito;
     Simbolo.prototype.rol = rol;
     Simbolo.prototype.apuntador= apu;
     Simbolo.prototype.tamanio=size;
};


Simbolo.prototype.setValoresPila = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    Simbolo.prototype.nombreCorto= nombreC;
     Simbolo.prototype.tipoSimbolo= tipoSimb;
     Simbolo.prototype.tipoElemento= tipoElemento;
     Simbolo.prototype.ambito= ambito;
     Simbolo.prototype.rol = rol;
     Simbolo.prototype.apuntador= apu;
     Simbolo.prototype.tamanio=size;
};

Simbolo.prototype.setValoresCola = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    Simbolo.prototype.nombreCorto= nombreC;
     Simbolo.prototype.tipoSimbolo= tipoSimb;
     Simbolo.prototype.tipoElemento= tipoElemento;
     Simbolo.prototype.ambito= ambito;
     Simbolo.prototype.rol = rol;
     Simbolo.prototype.apuntador= apu;
     Simbolo.prototype.tamanio=size;
};


Simbolo.prototype.setValoresPuntero = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    Simbolo.prototype.nombreCorto= nombreC;
     Simbolo.prototype.tipoSimbolo= tipoSimb;
     Simbolo.prototype.tipoElemento= tipoElemento;
     Simbolo.prototype.ambito= ambito;
     Simbolo.prototype.rol = rol;
     Simbolo.prototype.apuntador= apu;
     Simbolo.prototype.tamanio=size;
};



Simbolo.prototype.getHTMLSimbolo = function() {

        var cadenaSimbolo= "<tr>"
            +"<td>"+Simbolo.prototype.ambito +"</td>"
            +"<td>"+Simbolo.prototype.tipoSimbolo +"</td>"
            +"<td>"+Simbolo.prototype.rol +"</td>"
            +"<td>"+Simbolo.prototype.Visibilidad +"</td>"
            +"<td>"+Simbolo.prototype.nombreCorto+"</td>"
            +"<td>"+Simbolo.prototype.tipoElemento +"</td>"
            +"<td>"+Simbolo.prototype.apuntador +"</td>"
            +"<td>"+Simbolo.prototype.tamanio +"</td>"
            +"<td>"+Simbolo.prototype.noParametros +"</td>"
            +"<td>"+Simbolo.prototype.parametrosFuncionCadena +"</td>"
            +"<td>"+Simbolo.prototype.nombreFuncion +"</td>"
            +"<td>"+Simbolo.prototype.noDimensiones +"</td>"
            +"</tr>";

            return cadenaSimbolo;


};

