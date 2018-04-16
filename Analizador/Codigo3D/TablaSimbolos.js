var Ambito = require("./Ambito");
function TablaSimbolos(){
	this.listaSimbolos=[];
}


TablaSimbolos.prototype.insertarSimbolosClase = function(simbolos) {
	for(var i =0; i<simbolos.length; i++){
		this.listaSimbolos.push(simbolos[i]);
	}
};



TablaSimbolos.prototype.obteberAtributosClase = function(nombreClase){
  var simbTemporal;
  var ret = [];
  for(var i = 0; i<this.listaSimbolos.length; i++){
    simbTemporal = this.listaSimbolos[i];
    if(simbTemporal.expresionAtributo!=null && 
       simbTemporal.rol.toUpperCase() == "ATRIBUTO" && 
       simbTemporal.ambito.toUpperCase() == nombreClase.toUpperCase() ){
        ret.push(simbTemporal);
    }
  }

  return ret;
};


TablaSimbolos.prototype.obtenerTipo= function (nombre, ambitos){
   
  var ambitoTemporal;
  var simbTemporal;  
  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
   // console.log("Ambito : "+ambitoTemporal );
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
    //  console.log("Simbolo  --------> "+ simbTemporal.nombreCorto + "       Ambito -----------> "+ simbTemporal.ambito);
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           return simbTemporal.tipoElemento;
         }
    }

  }

  return "";

};


TablaSimbolos.prototype.obtenerPosLocal= function (nombre, ambitos){
   
  var ambitoTemporal;
  var simbTemporal;  
  for(var i = 0; i<ambitos.ambitos.length; i++){
      if(i != ambitos.ambitos.length -1){

        ambitoTemporal = ambitos.ambitos[i];
      for(var j =0; j< this.listaSimbolos.length; j++){
        simbTemporal = this.listaSimbolos[j];
        if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
          simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
            return simbTemporal.apuntador;
          }
      }

    }
  }

  return -1;

};


TablaSimbolos.prototype.obtenerPosAtributo= function (nombre, ambitos){
   
  var ambitoTemporal;
  var simbTemporal;  
  for(var i = 0; i<ambitos.ambitos.length; i++){
      if(i == ambitos.ambitos.length -1){

        ambitoTemporal = ambitos.ambitos[i];
      for(var j =0; j< this.listaSimbolos.length; j++){
        simbTemporal = this.listaSimbolos[j];
        if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
          simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
            return simbTemporal.apuntador;
          }
      }

    }

    

  }

  return -1;

};


TablaSimbolos.prototype.esAtributo = function(nombre, ambitos){
  var ambitoTemporal;
  var simbTemporal;  
  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           if(simbTemporal.rol.toUpperCase()!="ATRIBUTO")
              return false;
         }
    }

  }

  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           if(simbTemporal.rol.toUpperCase()=="ATRIBUTO")
              return true;
         }
    }

  }



  return null;


};


TablaSimbolos.prototype.SizeClase = function(nombre) {
  var simbTemporal;
  for(var i = 0; i<this.listaSimbolos.length; i++){
    simbTemporal = this.listaSimbolos[i];
    if(simbTemporal.rol.toUpperCase() == "CLASE" && 
       simbTemporal.tipoSimbolo.toUpperCase() == "CLASE" &&
      simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
        return simbTemporal.tamanio;
      }

  }

  return -1;

};


TablaSimbolos.prototype.obtenerFirmaMetodo = function(nombreClase, noParametros, nombreFuncion){

  var temp;
  //console.log(nombreClase + " " + noParametros + "  " + nombreFuncion);
  //console.log("Aquiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  for(var i =0; i<this.listaSimbolos.length; i++){
    temp= this.listaSimbolos[i];
   // console.log(temp.ambito + " " + temp.noParametros + "  " + temp.nombreFuncion);
    if(temp.ambito.toUpperCase() == nombreClase.toUpperCase() &&
       temp.noParametros == noParametros &&
       temp.nombreFuncion.toUpperCase() == nombreFuncion.toUpperCase()){
         return temp.nombreCorto;
       }

  }

  return "";

};




TablaSimbolos.prototype.sizeFuncion = function(nombreClase, firmaMetodo){

  var item;
  console.log("ESTOY BUSANDO    "+ nombreClase+ firmaMetodo);
  for(var i =0; i<this.listaSimbolos.length; i++){
    item = this.listaSimbolos[i];
    if(item.ambito.toUpperCase() == nombreClase.toUpperCase() &&
       item.nombreCorto.toUpperCase() == firmaMetodo.toUpperCase()){
         return item.tamanio;
       }

  }

  return -1;

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