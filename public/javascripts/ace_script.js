$(document).ready(function(){
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/javascript");

	var editor_3d = ace.edit("intermediate-editor");
	editor_3d.setTheme("ace/theme/monokai");
	editor_3d.session.setMode("ace/mode/javascript");

	var socket = io.connect('http://localhost:4200');

	if($('#code').val() != undefined){
		editor.setValue($('#code').val());
	}

	socket.on('message', function(data){

		alert('Message recieved: ' + data.message);
	});

	socket.on('news', function(data){

		var value = prompt(data.msgToShow, "");
 		if(value != null){
 			$.ajax(
			      {
			        type:"POST",
			        url:" http://localhost:7000/set-value",
			        data:{value: value},
			        success: function(data){
			          console.log("success!", data);
			        },
			        error: function(data){
			          console.log("error!");
			        }
			  
			      }
    		);
 		}
		
		

	});
	document.getElementById("openFile").addEventListener('change', function(){
        var fr = new FileReader();
        fr.onload=function(){
          editor.setValue(this.result);
      
        }
        fr.readAsText(this.files[0]);
      
      });

	$('.build-link').on('click', function(e){
		e.preventDefault();

		var getStats = function(){
			$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getSymbolTable",
			        
			        success: function(data){
			          	$('#menu1').html(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
    		$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getErrors",
			        
			        success: function(data){
			          	$('#menu2').html(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
    		$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getStack",
			        
			        success: function(data){
			          	$('#menu3').html(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
    		$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getHeap",
			        
			        success: function(data){
			          	$('#menu4').html(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
    		$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getTemps",
			        
			        success: function(data){
			          	$('#menu5').html(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
    		$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getGeneratedCode",
			        
			        success: function(data){
			          	editor_3d.setValue(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
    		$.ajax(
			      {
			        type:"GET",
			        url:" http://localhost:3000/getConsole",
			        
			        success: function(data){
			          	$('#console').html(data);
			        },
			        error: function(data){
			          console.dir(data);
			        }
			  
			      }
    		);
		}

		var code = editor.getValue();
		$.ajax(
	      {
	        type:"POST",
	        url:" http://localhost:3000/parser",
	        data:{string_file: code},
	        success: function(data){
	          console.dir(data);
	          getStats();
	        },
	        error: function(data){
	          console.dir(data);
	        }
	  
	      }
    	);

		
	});
	$('.debug-link').on('click', function(e){
		e.preventDefault();
		$.ajax(
	      {
	        type:"POST",
	        url:" http://localhost:7000/set-value",
	        data:{value: "hi"},
	        success: function(data){
	          console.log("success!", data);
	        },
	        error: function(data){
	          console.log("error!");
	        }
	  
	      }
    	);
		
	});
	$('.resume-link').on('click', function(e){
		e.preventDefault();
		
		
	});
	$('.next-link').on('click', function(e){
		e.preventDefault();
		
		
	});
	$('.skip-link').on('click', function(e){
		e.preventDefault();
		
		
	});
	$('.automatic-link').on('click', function(e){
		e.preventDefault();
		
		
	});
	$('.export-link').on('click', function(e){
		e.preventDefault();
		
		
	});
	$('.import-link').on('click', function(e){
		e.preventDefault();
		
		$('#openFile').click();
	});
});
