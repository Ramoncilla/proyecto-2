$(document).ready(function(){
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/javascript");

	var editor_3d = ace.edit("intermediate-editor");
	editor_3d.setTheme("ace/theme/monokai");
	editor_3d.session.setMode("ace/mode/javascript");

	var socket = io.connect('http://localhost:4200');

	socket.on('message', function(data){

		alert('Message recieved: ' + data.message);
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
		var code = editor.getValue();
		$.ajax(
	      {
	        type:"POST",
	        url:" http://localhost:3000/parser",
	        data:{string_file: code},
	        success: function(data){
	          console.dir(data);
	        },
	        error: function(data){
	          console.dir(data);
	        }
	  
	      }
    	);
		
	});
	$('.debug-link').on('click', function(e){
		e.preventDefault();
		
		
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
