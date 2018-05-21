$(document).ready(function(){

	var editor = ace.edit("lesson-example");
	
	editor.session.setMode("ace/mode/javascript");
	editor.setValue($('#lesson-example-hidden').val());

	var solveEditor = ace.edit("lesson-solution");
	
	solveEditor.session.setMode("ace/mode/javascript");
	
	$('.build-lesson').on('click', function(){

	});
	$('.solve-lesson').on('click', function(){

		$.ajax(
        {
          type:"POST",
          url:" /lesson/take",
          data : {
          	code : solveEditor.getValue(),
          	result: $('#lesson-result').val()
          },
          success: function(data){
            console.log(data);
            
          },
          error: function(data){
            console.log("errorr");
                  
          }
          
        }
      );

	});


});
