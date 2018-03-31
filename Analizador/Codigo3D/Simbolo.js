
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
 

 
 Simbolo.prototype.setVisibilidad = function(vis) {
     // body...
     console.log("entradno  "+ vis);
 	this.visibilidad=vis;
 };

 Simbolo.prototype.setExpresionAtributo = function(exp) {
 	// body...
 	this.expresionAtributo=exp;
 };
 
 
 Simbolo.prototype.setValoresVariable = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
 	 this.nombreCorto= nombreC;
 	 this.tipoSimbolo= tipoSimb;
 	 this.tipoElemento= tipoElemento;
 	 this.ambito= ambito;
 	 this.rol = rol;
 	 this.apuntador= apu;
 	 this.tamanio=size;

 };


 Simbolo.prototype.setValoresArreglo = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size, noDimensiones, listaDim) {
     this.nombreCorto = nombreC;
     this.tipoSimbolo= tipoSimb;
     this.tipoElemento= tipoElemento;
     this.ambito= ambito;
     this.rol = rol;
     this.apuntador= apu;
     this.tamanio = size;
     this.noDimensiones= noDimensiones;
     this.dimensiones = listaDim;

 };


Simbolo.prototype.setValoresLista = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    this.nombreCorto= nombreC;
     this.tipoSimbolo= tipoSimb;
     this.tipoElemento= tipoElemento;
     this.ambito= ambito;
     this.rol = rol;
     this.apuntador= apu;
     this.tamanio=size;
};


Simbolo.prototype.setValoresPila = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    this.nombreCorto= nombreC;
     this.tipoSimbolo= tipoSimb;
     this.tipoElemento= tipoElemento;
     this.ambito= ambito;
     this.rol = rol;
     this.apuntador= apu;
     this.tamanio=size;
};

Simbolo.prototype.setValoresCola = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    this.nombreCorto= nombreC;
     this.tipoSimbolo= tipoSimb;
     this.tipoElemento= tipoElemento;
     this.ambito= ambito;
     this.rol = rol;
     this.apuntador= apu;
     this.tamanio=size;
};


Simbolo.prototype.setValoresPuntero = function(nombreC, tipoSimb, tipoElemento, ambito, rol, apu, size ) {
    // body...
    this.nombreCorto= nombreC;
     this.tipoSimbolo= tipoSimb;
     this.tipoElemento= tipoElemento;
     this.ambito= ambito;
     this.rol = rol;
     this.apuntador= apu;
     this.tamanio=size;
};



Simbolo.prototype.getHTMLSimbolo = function() {

        var cadenaSimbolo= "<tr>"
            +"<td>"+this.ambito +"</td>"
            +"<td>"+this.tipoSimbolo +"</td>"
            +"<td>"+this.rol +"</td>"
            +"<td>"+this.visibilidad +"</td>"
            +"<td>"+this.nombreCorto+"</td>"
            +"<td>"+this.tipoElemento +"</td>"
            +"<td>"+this.apuntador +"</td>"
            +"<td>"+this.tamanio +"</td>"
            +"<td>"+this.noParametros +"</td>"
            +"<td>"+this.parametrosFuncionCadena +"</td>"
            +"<td>"+this.nombreFuncion +"</td>"
            +"<td>"+this.noDimensiones +"</td>"
            +"</tr>";

            return cadenaSimbolo;


};

module.exports=Simbolo;