var grammarInterprete = require("./interprete");
var listaErrores = require("../Errores/listaErrores");
var listaTemporales = require("./listaTemporales");
var funcion = require("./ArbolInterprete/Funcion");
var temporal = require("../Interprete/temporal");
var obtenerNombres = require("../Codigo3D/sentenciaNombre");

var errores = new listaErrores();
var nombres = new obtenerNombres();

function AnalizadorInterprete(){
    this.funciones =[];
    this.temporales = new listaTemporales();
    this.bandera =0;
    this.heap = [];
    this.stack =[];
    this.cadenaImpresion ="";

}


AnalizadorInterprete.prototype.imprimirStack= function(){

    var cad = "<table border= 1><tr><td>Posicion</td> <td>Valor</td></tr>";
    for(var i =0; i< this.stack.length; i++){
        cad+="<tr><td>"+i+"</td><td>"+ this.stack[i]+"</td></tr>";
    }
    cad+="</table>";
    return cad;
};

AnalizadorInterprete.prototype.imprimirHeap= function(){

    var cad = "<table border= 1><tr><td>Posicion</td> <td>Valor</td></tr>";
    for(var i =0; i< this.heap.length; i++){
        cad+="<tr><td>"+i+"</td><td>"+ this.heap[i]+"</td></tr>";
    }
    cad+="</table>";
    return cad;
};

AnalizadorInterprete.prototype.Ejecutar3D= function(codigo3D, principal){
    if(codigo3D!= ""){
        this.inicializarEstructuras();
        var p = new temporal("P",0);
        var h = new temporal("H",0);
        this.temporales.insertarTemporal(p);
        this.temporales.insertarTemporal(h);

       this.funciones = grammarInterprete.parse(codigo3D);
        var funTemporal, sentTemporal;
        //buscamos la funcion princiapl la cual vamos a iniciar a ejecutar
        for(var i = 0; i< this.funciones.length; i++){
            funTemporal = this.funciones[i];
            if(funTemporal.nombre.toUpperCase() == principal.toUpperCase()){
                for(var j = 0; j <funTemporal.instrucciones.length; j++){
                    sentTemporal = funTemporal.instrucciones[j];
                    if(this.bandera==1){
                        break;
                    }
                    this.ejecutarInstruccion(sentTemporal);
                }
                
            }

        }
    
    }else{
        errores.insertarError("Semantico", "En ejecucion 3D, no se puede ejecutar una cadena vacia");
    }

};

AnalizadorInterprete.prototype.inicializarEstructuras = function(){
    for(var i = 0; i<2000; i++){
        this.stack.push(36);
    }

    for(var i=0; i<12000;i++){
        this.heap.push(36);
    }



};

AnalizadorInterprete.prototype.ejecutarInstruccion= function(instruccion){

    var nombreInstruccion = nombres.obtenerNombre3D(instruccion).toUpperCase();

    switch(nombreInstruccion){

        case "ARITMETICA":{
            this.resolverOperacion(instruccion);
            break;
        }

        case "GET_ASIG_ED_3D":{
            this.resolverEDD(instruccion);

            break;
        }

        case "ASIG_3D":{

            break;
        }

        case "LLAMADA":{
            var nombre = instruccion.nombreFuncion;
            var funTemporal, sentTemporal;
            for(var i = 0; i< this.funciones.length; i++){
                funTemporal = this.funciones[i];
                if(funTemporal.nombre.toUpperCase() == nombre.toUpperCase()){
                    console.log("------------------ Ejecutando llamada a "+nombre+" ----------");
                    for(var j = 0; j <funTemporal.instrucciones.length; j++){
                        sentTemporal = funTemporal.instrucciones[j];
                        if(this.bandera==1){
                            break;
                        }
                        this.ejecutarInstruccion(sentTemporal);
                    }
                    
                }
    
            }
            break;
        }

        case "IMPRIMIR":{
            var tipo = instruccion.tipoImpresion;
            var exp = instruccion.expresion;
            var vVal = this.resolverValor(exp);
           // console.log("-----------------QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ----------------");
           // console.dir(instruccion);
           // console.dir(vVal);
           // console.dir(exp);
            

            if(vVal!="nulo"){
                if(tipo == "\"%c\""){
                    //char     
                    var res = String.fromCharCode(vVal);
                    this.agregarImpresion(res);
                }
    
                if(tipo == "\"%d\"" ){
                    //entero
                    var res = parseInt(vVal);
                    this.agregarImpresion(res);
    
                }
    
                if(tipo == "\"%f\"") {
                    //decimal
                    var res = parseFloat(vVal);
                    this.agregarImpresion(res);
                }

            }
            break;
        }

        case "RELACIONAL":{

            break;
        }

        case "ETIQUETA":{

            break;
        }

        case "SALTO":{

            break;
        }

    }



};

AnalizadorInterprete.prototype.agregarImpresion = function(cad){
    this.cadenaImpresion+=cad+"\n";
};


AnalizadorInterprete.prototype.resolverEDD= function(sent){
    
    var tipo = sent.tipo;
    var pos = sent.posicion;
    var val = sent.valor;
    var ed = sent.ed;
        //tipo 1 =>  stack[t1] = t2; entra 2=> sale t2 = stack[t1] 
        //ed 0-> stack 1-> heap
        var vPos = this.resolverValor(pos);


       if(vPos!="nulo"){

        if(tipo == 1){
            //asignaremos a una posicione especiafica a una edd
            var vVal = this.resolverValor(val);
            if(vVal!="nulo"){
                if(ed == 0){
                    //stack
                    //console.log("Voy a insertar en stack pos "+vPos+", el valor "+ vVal);
                    this.stack[parseInt(vPos)]=parseFloat(vVal);
                }
                if(ed == 1){
                    //heap
                    this.heap[parseInt(vPos)]=parseFloat(vVal);
                   // console.log("Voy a insertar en heap pos "+vPos+", el valor "+ vVal);
                } 
            }else{
                errores.insertarError("Semantico", "Ha ocurrido un erro al determinar el valor 3D");
            }
            
        }
        
        if(tipo ==2){
            
            if(val.tipo.toUpperCase() == "ID"){

                if(ed==0){
                    var a = this.stack[parseInt(vPos)];
                    var tmp = new temporal(val.valor,a);
                    this.temporales.insertarTemporal(tmp);
                   // console.log("Voy a obtener  en stack pos "+vPos+", el valor "+ val.valor);

                }
                if(ed ==1){
                    var a = this.heap[parseInt(vPos)];
                    var tmp = new temporal(val.valor,a);
                    this.temporales.insertarTemporal(tmp);
                    //console.log("Voy a obtener  en heap pos "+vPos+", el valor "+ val.valor);


                }


            }else{
                errores.insertarError("Semantico","Ha ocurrido un error debe ser obligatoriamente un id para asignar");
            }



        }

       }else{
           errores.insertarError("Semantico","Posicion no valido para heap o Stack");
       }
       

     
                    

            
       
};


AnalizadorInterprete.prototype.resolverOperacion = function(sent){
    var operador = sent.signo;
    var val1 = sent.operando1;
    var val2 = sent.opernado2;
    var valCont = sent.varContenedor;

    switch(operador){

        case "+":{
            var v1 = this.resolverValor(val1);
            var v2 = this.resolverValor(val2);
            var varAsig = valCont.valor;

            if(v1 != "nulo" && v2 != "nulo"){
                if(v1=="vacio"){
                    v1=0;
                }
                if(v2== "vacio"){
                    v2=0;
                }
                var res = parseFloat(v1)+parseFloat(v2);
                var temp = new temporal(varAsig,res);
                this.temporales.insertarTemporal(temp);
            }else{
                //error
            }

            break;

        }

        case "-":{
            var v1 = this.resolverValor(val1);
            var v2 = this.resolverValor(val2);
            var varAsig = valCont.valor;

            if(v1 != "nulo" && v2 != "nulo"){
                if(v1=="vacio"){
                    v1=0;
                }
                if(v2== "vacio"){
                    v2=0;
                }
                var res = parseFloat(v1)-parseFloat(v2);
                var temp = new temporal(varAsig,res);
                this.temporales.insertarTemporal(temp);
            }else{
                //error
            }

            break;

        }

        case "*":{
            var v1 = this.resolverValor(val1);
            var v2 = this.resolverValor(val2);
            var varAsig = valCont.valor;

            if(v1 != "nulo" && v2 != "nulo"){
                if(v1=="vacio"){
                    v1=0;
                }
                if(v2== "vacio"){
                    v2=0;
                }
                var res = parseFloat(v1)*parseFloat(v2);
                var temp = new temporal(varAsig,res);
                this.temporales.insertarTemporal(temp);
            }else{
                //error
            }

            break;

        }

        case "/":{
            var v1 = this.resolverValor(val1);
            var v2 = this.resolverValor(val2);
            var varAsig = valCont.valor;

            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

            console.dir(v1);
            console.dir(v2);

            if(v1 != "nulo" && v2 != "nulo"){
                if(v1=="vacio"){
                    v1=0;
                }
                if(v2== "vacio"){
                    v2=0;
                }
                var res = parseFloat(v1) /parseFloat(v2);
                
                console.dir(res);
                var temp = new temporal(varAsig,res);
                this.temporales.insertarTemporal(temp);
            }else{
                //error
            }

            break;

        }

        case "^":{
            var v1 = this.resolverValor(val1);
            var v2 = this.resolverValor(val2);
            var varAsig = valCont.valor;

            if(v1 != "nulo" && v2 != "nulo"){
                if(v1=="vacio"){
                    v1=0;
                }
                if(v2== "vacio"){
                    v2=0;
                }
                var res = parseFloat(v1) ^ parseFloat(v2);
                var temp = new temporal(varAsig,res);
                this.temporales.insertarTemporal(temp);
            }else{
                //error
            }

            break;

        }
       
    }
    

};


AnalizadorInterprete.prototype.resolverValor = function(val){

    if(val.tipo.toUpperCase() == "ENTERO"){
        return val.valor;
    }

    if(val.tipo.toUpperCase() == "DECIMAL"){
        return val.valor;
    }
    
    if(val.tipo.toUpperCase()== "NEGATIVO"){
        var valTemp = val.valor;
        if(valTemp.tipo.toUpperCase() == "ENTERO"){
            var t= parseInt(valTemp.valor);
            return -t;
        }

        if(valTemp.tipo.toUpperCase()== "DECIMAL"){
            var t = parseFloat(valTemp.valor);
            return -t;
        }

        if(valTemp.tipo.toUpperCase()=="ID"){
            var v = this.temporales.obtenerValorTemporal(valTemp.valor);
            if(v.toUpperCase() != "NULO"){
                var t = parseFloat(valTemp.valor);
                return -t;
            }
        }

    }

    if(val.tipo.toUpperCase()=="VACIO"){
        return "vacio";

    }

    if(val.tipo.toUpperCase() == "ID"){
        var v = this.temporales.obtenerValorTemporal(val.valor);
        return v;
    }


    return "nulo";
};






module.exports = AnalizadorInterprete;

