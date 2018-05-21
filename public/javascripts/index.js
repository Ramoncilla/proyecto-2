$(document).ready(function(){




  console.log("asdfasdfa");        
  $.ajax(
    {
      type:"GET",
      url:" /lesson/bulkLoad",
      success: function(data){
        console.log(data);
      },
      error: function(data){
        console.log("errorr");
              
      }
      
    }
  );
    



});