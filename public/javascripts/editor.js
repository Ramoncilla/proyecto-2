$(document).ready(function(){
    
    document.getElementById("openFile").addEventListener('change', function(){
        var fr = new FileReader();
        fr.onload=function(){
          document.getElementById("fileContent").value= this.result;
      
        }
        fr.readAsText(this.files[0]);
      
      });

});





