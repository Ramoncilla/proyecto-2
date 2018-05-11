var Ambito = require("./Ambito");
function TablaSimbolos(){
	this.listaSimbolos=[];
}



TablaSimbolos.prototype.obtenerParametros = function(firmaFuncion){

  var simboloTemporal;
  var parametros = [];
  for(var i =0; i<this.listaSimbolos.length; i++){
    simboloTemporal = this.listaSimbolos[i];
    if(simboloTemporal.rol.toUpperCase() == "PARAMETRO"){
      if(simboloTemporal.ambito.toUpperCase()== firmaFuncion.toUpperCase()){
           parametros.push(simboloTemporal);
         }
    }
  }
  return parametros;
};


TablaSimbolos.prototype.obtenerTipoFuncion = function(nombreFuncion){
  
  var simboloTemporal;
  for(var i =0; i<this.listaSimbolos.length; i++){
    simboloTemporal = this.listaSimbolos[i];
    if(simboloTemporal.rol.toUpperCase() == "FUNCION"){
      if(simboloTemporal.nombreCorto.toUpperCase()== nombreFuncion.toUpperCase()){
           return simboloTemporal.tipoElemento;
         }
    }
  }
  return "";
};

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

/*
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

};*/

 
/* --------------------------------- Obtener Tipo --------------------------------------- */

TablaSimbolos.prototype.obtenerPosAtributoAcceso = function(nombreClase, nombreAtributo){
  
  var simbTemporal;
  for(var i = 0; i<this.listaSimbolos.length; i++){
    simbTemporal = this.listaSimbolos[i];
    if(simbTemporal.ambito.toUpperCase() == nombreClase.toUpperCase() &&
       simbTemporal.rol.toUpperCase() == "ATRIBUTO" && 
       simbTemporal.nombreCorto.toUpperCase() == nombreAtributo.toUpperCase()){
         return simbTemporal.apuntador;
       }
  }
  return -1;

};


TablaSimbolos.prototype.obtenerPosTipoSimboloAcceso = function(nombreClase, nombreAtributo){
  
  var simbTemporal;
  for(var i = 0; i<this.listaSimbolos.length; i++){
    simbTemporal = this.listaSimbolos[i];
    if(simbTemporal.ambito.toUpperCase() == nombreClase.toUpperCase() &&
       simbTemporal.rol.toUpperCase() == "ATRIBUTO" && 
       simbTemporal.nombreCorto.toUpperCase() == nombreAtributo.toUpperCase()){
         return simbTemporal.tipoSimbolo;
       }
  }
  return "";

};



TablaSimbolos.prototype.obtenerTipoAtributoAcceso = function(nombreClase, nombreAtributo){
  
  var simbTemporal;
  for(var i = 0; i<this.listaSimbolos.length; i++){
    simbTemporal = this.listaSimbolos[i];
    if(simbTemporal.ambito.toUpperCase() == nombreClase.toUpperCase() &&
       simbTemporal.rol.toUpperCase() == "ATRIBUTO" && 
       simbTemporal.nombreCorto.toUpperCase() == nombreAtributo.toUpperCase()){
         return simbTemporal.tipoElemento;
       }
  }
  return "nulo";

};


TablaSimbolos.prototype.obtenerTipo= function (nombre, ambitos){
   
  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  for(var i =0; i<ambitos.ambitos.length; i++){
    cadenaAmbito = ambitoTemporal.getAmbitos();
    var cont= this.getTipo(cadenaAmbito,nombre);
    if(cont!=""){
      return cont;
    }
    ambitoTemporal.ambitos.shift();
}
return "";

};


TablaSimbolos.prototype.getTipo = function(cadenaAmbito, nombre ){
  var simTemporal;

  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
              return simTemporal.tipoElemento;
            
              
          }
      }
  }
return "";
};



/*  --------------------------------- Obtener Posicion Local ------------------------------ */

TablaSimbolos.prototype.obtenerPosLocal= function(nombre, ambitos){
  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  for(var i =0; i<ambitos.ambitos.length; i++){
    cadenaAmbito = ambitoTemporal.getAmbitos();
    var cont= this.posLocal(cadenaAmbito,nombre);
    if(cont>=0){
      return cont;
    }
    ambitoTemporal.ambitos.shift();
}
return -1;
  
};


TablaSimbolos.prototype.posLocal = function(cadenaAmbito, nombre ){
  var simTemporal;

  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()!="ATRIBUTO"){
              return simTemporal.apuntador;
            }
              
          }
      }
  }
return -1;
};





/*  --------------------------------- Obtener Posicion Global ------------------------------ */

TablaSimbolos.prototype.obtenerPosAtributo= function(nombre, ambitos){
  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  for(var i =0; i<ambitos.ambitos.length; i++){
    cadenaAmbito = ambitoTemporal.getAmbitos();
    var cont= this.posGlobal(cadenaAmbito,nombre);
    if(cont>=0){
      return cont;
    }
    ambitoTemporal.ambitos.shift();
}
return -1;
  
};


TablaSimbolos.prototype.posGlobal = function(cadenaAmbito, nombre ){
  var simTemporal;

  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()=="ATRIBUTO"){
              return simTemporal.apuntador;
            }
              
          }
      }
  }
return -1;
};


TablaSimbolos.prototype.esAtributo= function(nombre, ambitos){
  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  var cont =0;
  var temporal;
  var cadenaAmbito="";
   
  if(this.listaSimbolos == 0){
      cont+=0;
  }
  else{
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        cont=cont + this.existeListaLocal(cadenaAmbito,nombre);
        if(cont>0){
          return false;
        }
        ambitoTemporal.ambitos.shift();
    }
}


  ambitoTemporal = new Ambito();
  arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

   cont =0;
   temporal;
   cadenaAmbito="";
   
  if(this.listaSimbolos == 0){
      cont+=0;
  }
  else{
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        cont=cont + this.existeListaGlobal(cadenaAmbito,nombre);
        if(cont>0){
          return true;
        }
        ambitoTemporal.ambitos.shift();
    }
}


return null;

};


TablaSimbolos.prototype.existeListaGlobal = function(cadenaAmbito, nombre ){
  var simTemporal;
  var cont =0;
  nombre= nombre+"";
  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()=="ATRIBUTO"){
             //return false;
              //console.logconsole.log("existe el simbolo "+nombre);
              cont++;
            }
              
          }
      }
  }
return cont;
};


TablaSimbolos.prototype.existeListaLocal = function(cadenaAmbito, nombre ){
  var simTemporal;
  var cont =0;
  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.ambito.toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()!="ATRIBUTO"){
             //return false;
              //console.log("existe el simbolo "+nombre);
              cont++;
            }
              
          }
      }
  }
return cont;
};




/*
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
*/

//

TablaSimbolos.prototype.obtenerSimbolo = function(nombre, ambitos, tipoAtr){
  var ambitoTemporal;
  var simbTemporal;
  
 if(!tipoAtr){// es local

  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  var cadenaAmbito="";
   
  if(this.listaSimbolos == 0){
      return null;
  }
  else{
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        var cont= this.buscarLocal(cadenaAmbito,nombre);
        if(cont!=null){
          return cont;
        }
        ambitoTemporal.ambitos.shift();
    }
}

 }else{ // es atributo

  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  var cadenaAmbito="";
   
  if(this.listaSimbolos == 0){
      return null;
  }
  else{
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        var cont=this.buscarGlobal(cadenaAmbito,nombre);
        if(cont!=null){
          return cont;
        }
        ambitoTemporal.ambitos.shift();
    }
}

 }


  return null;


};


TablaSimbolos.prototype.buscarGlobal = function(cadenaAmbito, nombre ){
  var simTemporal;
  var cont =0;
  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()=="ATRIBUTO"){
             //return false;
              return this.listaSimbolos[i];
            }
              
          }
      }
  }
return null;
};


TablaSimbolos.prototype.buscarLocal = function(cadenaAmbito, nombre ){
  var simTemporal;
  var cont =0;
  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()!="ATRIBUTO"){
             //return false;
              return this.listaSimbolos[i];
            }
              
          }
      }
  }
return null;
};


/*
TablaSimbolos.prototype.obtenerSimbolo = function(nombre, ambitos, tipoAtr){
  var ambitoTemporal;
  var simbTemporal;
  
  
 if(!tipoAtr){
  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           if(simbTemporal.rol.toUpperCase()!="ATRIBUTO")
              return simbTemporal;
         }
    }

  }

 }else{

  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           if(simbTemporal.rol.toUpperCase()=="ATRIBUTO")
              return simbTemporal;
         }
    }

  }

 }


  return null;


};*/




/*
//
TablaSimbolos.prototype.setArregloNs = function(nombre, ambitos, tipoAtr, arr){
  var ambitoTemporal;
  var simbTemporal;
  
  console.log("oooooooooooooooo");
  console.dir(arr);
 if(!tipoAtr){
 console.log("es local");
  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           if(simbTemporal.rol.toUpperCase()!="ATRIBUTO"){
            if(simbTemporal.tipoSimbolo.toUpperCase() == "ARREGLO"){
             console.log("lo hare");
              this.listaSimbolos[j].setArregloNs(arr);
            }

           }
              
         }
    }

  }

 }else{
   
  console.log("es atributo");
  for(var i = 0; i<ambitos.ambitos.length; i++){
    ambitoTemporal = ambitos.ambitos[i];
    for(var j =0; j< this.listaSimbolos.length; j++){
      simbTemporal = this.listaSimbolos[j];
      if(simbTemporal.ambito.toUpperCase() == ambitoTemporal.toUpperCase() &&
         simbTemporal.nombreCorto.toUpperCase() == nombre.toUpperCase()){
           if(simbTemporal.rol.toUpperCase()=="ATRIBUTO")
              {
                if(simbTemporal.tipoSimbolo.toUpperCase() == "ARREGLO"){
                  this.listaSimbolos[j].setArregloNs(arr);
                }
                
              }
         }
    }

  }

 }


 


};
*/



TablaSimbolos.prototype.setArregloNs = function(nombre, ambitos, tipoAtr,arr22){
  var ambitoTemporal;
  var simbTemporal;
  
 if(!tipoAtr){// es local

  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  var cadenaAmbito="";
   
 
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        var cont= this.arregloLocal(cadenaAmbito,nombre,arr22);
        if(cont==true){
          break;
        }
        ambitoTemporal.ambitos.shift();
    }


 }else{ // es atributo

  var ambitoTemporal = new Ambito();
  var arr= ambitos.ambitos.slice();
  ambitoTemporal.setAmbitos(arr);

  var cadenaAmbito="";
   
 
    for(var i =0; i<ambitos.ambitos.length; i++){
        cadenaAmbito = ambitoTemporal.getAmbitos();
        var cont=this.arregloGlobal(cadenaAmbito,nombre,arr22);
        if(cont==true){
          break;
        }
        ambitoTemporal.ambitos.shift();
    }


 }


  


};


TablaSimbolos.prototype.arregloGlobal = function(cadenaAmbito, nombre, arre ){
  var simTemporal;
  var cont =0;
  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()=="ATRIBUTO"){
             //return false;
             this.listaSimbolos[i].setArregloNs(arre);
             return true;
            }
              
          }
      }
  }
  return false;
};


TablaSimbolos.prototype.arregloLocal = function(cadenaAmbito, nombre, arre ){
  var simTemporal;
  var cont =0;
  for (var i =0; i<this.listaSimbolos.length; i++){
      simTemporal  = this.listaSimbolos[i];
      if(simTemporal.getAmbito().toUpperCase() == cadenaAmbito.toUpperCase()){
          if(simTemporal.getNombreCorto().toUpperCase() == nombre.toUpperCase()){
            if(simTemporal.rol.toUpperCase()!="ATRIBUTO"){
             //return false;
              this.listaSimbolos[i].setArregloNs(arre);
              return true;
            }
              
          }
      }
  }
  return false;
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
  //console.log("ESTOY BUSANDO    "+ nombreClase+ firmaMetodo);
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