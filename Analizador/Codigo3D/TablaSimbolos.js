function TablaSimbolos(){
	this.listaSimbolos=[];
}



TablaSimbolos.prototype.insertarSimbolosClase = function(simbolos) {
	for(var i =0; i<simbolos.length; i++){
		this.listaSimbolos.push(simbolos[i]);
	}
};

TablaSimbolos.prototype.obtenerHTMLTabla= function(){

    var encabezado="<table border =1><tr>"
    +"<th>Nombre</th>"
              +"<th> Ambito</th>"
              +"<th>Tipo Simbolo </th>"
              +"<th> Rol </th>"
              +"<th>Visibilidad</th>"
              
              +"<th>Tipo Elemento </th>"
              +"<th> Apuntador</th>"
              +"<th> Tamanio </th>"
              +"<th> No. Parametros</th>"
              +"<th> Cadena Parametros </th>"
              +"<th> Nombre Funcion </th>"
              +"<th> No. Dimensiones </th>"
              +"<th> Paso de referencia </th>"
              +"</tr>";
    var cuerpo ="";
    var temporal;          
    for (var i = 0; i < this.listaSimbolos.length; i++) {
      temporal = this.listaSimbolos[i];
      cuerpo +=temporal.getHTMLSimbolo();
    }
    var tabla =encabezado + cuerpo+"</table>";
    return tabla;

};

module.exports= TablaSimbolos;