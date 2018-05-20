$(document).ready(function(){




    $('#buttonLoad').on('click',function(){
        var cadenaArchivo = document.getElementById("fileContent").value;
        //console.log(cadenaArchivo);
        $.ajax(
          {
            type:"POST",
            url:" /cargaMasiva",
            data:{string_file: cadenaArchivo},
            success: function(data){
              if(data == true){
                alert("Lecciones han sido cargadas con exito");
                location.href ="/";
              }else{
                alert("Ha ocurrido un error con la carga de lecciones");
              }
            },
            error: function(data){
              console.log("errorr");
              console.dir(data);
            }
      
          }
        )
      });



});