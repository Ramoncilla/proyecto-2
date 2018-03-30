$(document).ready(function(){
    

 $('#btnAnalize').on('click',function(){
    var cadenaArchivo = document.getElementById("fileContent").value;
    console.log(cadenaArchivo);
    $.ajax(
      {
        type:"GET",
        url:"/parser",
        data:{string: cadenaArchivo},
        success: function(data){
          console.log(data);
        },
        error: function(data){
          console.dir(data);
        }
  
      }
    )
 });

    document.getElementById("openFile").addEventListener('change', function(){
        var fr = new FileReader();
        fr.onload=function(){
          document.getElementById("fileContent").value= this.result;
      
        }
        fr.readAsText(this.files[0]);
      
      });
      
      
     
});
