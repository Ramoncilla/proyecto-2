$(document).ready(function(){
    

    $('.btn-cancel').on('click',function(e){
      e.preventDefault();
    });

/*
    $('.btn-load').on('click',function(e){
      e.preventDefault(); 
    });*/

    $('#post-lesson').on("submit", function(e){
      e.preventDefault();
      var formData = new FormData($('#post-lesson')[0]);
      $.ajax(
        {
          type:"POST",
          url:"/postLesson",
          data:{lessonTitle: $('#lessonTitle').val(),
          lessonExplanation: $('#lessonExplanation').val(),
          codeExample: $('#codeExample').val(),
          homeworkStatement:$('#homeworkStatement').val(),
          homeworkTest:$('#homeworkStatement').val(),
          typeLesson : $('#typeLesson').val()
          },
          success: function(data){
            console.log(data);
            if(data.res == true){
              alert("La leccion ha sido creada con exito");
              location.href ="/";
            }else{
              alert("No se ha podido crear la leccion, ya existe");
            }
          },
          error: function(xhr,status,error){
            console.log(xhr.responseText);
          }
    
        }
      )
    });


 $('#btnAnalize').on('click',function(){
    var cadenaArchivo = document.getElementById("fileContent").value;
    //console.log(cadenaArchivo);
    $.ajax(
      {
        type:"POST",
        url:" http://localhost:3000/parser",
        data:{string_file: cadenaArchivo},
        success: function(data){
          console.dir(data);
        },
        error: function(data){
          console.dir(data);
        }
  
      }
    )
 });


 $('#buttonLoad').on('click',function(){
  var cadenaArchivo = document.getElementById("fileContent").value;
  //console.log(cadenaArchivo);
  $.ajax(
    {
      type:"POST",
      url:" /cargaMasiva",
      data:{string_file: cadenaArchivo},
      success: function(data){
        if(data.res == true){
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


 /*
    document.getElementById("openFile").addEventListener('change', function(){
        var fr = new FileReader();
        fr.onload=function(){
          document.getElementById("fileContent").value= this.result;
      
        }
        fr.readAsText(this.files[0]);
      
      });
*/
      
 
     

});





