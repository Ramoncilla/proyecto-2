$(document).ready(function(){
    

    var bulkLoad = function(){
      $.ajax(
        {
          type:"GET",
          url:" /lesson/bulkLoad",
          success: function(data){
            
            $('.list-container-lection').html(data);
          },
          error: function(data){
            console.log("errorr");
                  
          }
          
        }
      );
    }

    $('.btn-cancel').on('click',function(e){
      e.preventDefault();
    });

    
    $('#post-lesson').on("submit", function(e){
      e.preventDefault();
      var formData = new FormData($('#post-lesson')[0]);
      $.ajax(
        {
          type:"POST",
          url:"/lesson/post",
          data:{lessonTitle: $('#lessonTitle').val(),
          lessonExplanation: $('#lessonExplanation').val(),
          codeExample: $('#codeExample').val(),
          homeworkStatement:$('#homeworkStatement').val(),
          homeworkTest:$('#homeworkTest').val(),
          typeLesson : $('#typeLesson').val()
          },
          success: function(data){
            console.log(data);
            if(data == true){
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


  $('.list-container-lection').on('click', '.lesson-item', function(e){

      //e.preventDefault();

      //console.log($(this).data('name'));




  });


  var delay = (function(){
      var timer = 0;
      return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();
  $('#search-text').keyup(function () {
    var needle = $(this).val();
      delay(function(){
          
        $.ajax({
          type : "GET",
          url : "/lesson/search",
          data : { 
            needle : needle,
            type : $('#choose-type').val()
          },
        
          success: function(data){
            console.log(data);
            $('.list-container-lection').html(data);
            
          } ,
          error: function(data){

            console.log('error');
          } 

        });

      }, 1000 );
  });

  bulkLoad();

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





