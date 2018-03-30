$(document).ready(function(){
    

 $('#btnAnalize').on('click',function(){
    var cadenaArchivo = document.getElementById("fileContent").value;
    //console.log(cadenaArchivo);
   
    $.ajax(
      {
        type:"POST",
        url:" http://localhost:3000/parser",
        data:{string_file: cadenaArchivo},
        success: function(data){
          console.log(data);
        },
        error: function(data){
          console.dir(data);
        }
  
      }
    )

  /*
    $.ajax(
      {
        type:"GET",
        url:"/parser",
        data:JSON.stringify(cadenaArchivo),
        success: function(data){
          console.log(data);
        },
        error: function(data){
          console.dir(data);
        }
  
      }
    )
*/

   

 });

    document.getElementById("openFile").addEventListener('change', function(){
        var fr = new FileReader();
        fr.onload=function(){
          document.getElementById("fileContent").value= this.result;
      
        }
        fr.readAsText(this.files[0]);
      
      });
      
      
     
});
