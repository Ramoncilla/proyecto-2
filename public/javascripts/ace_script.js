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

	$('.build-link').on('click', function(e){
		e.preventDefault();
		console.log('Building');
		socket.emit('send.message', {
			message : "Hi"
		})
	});
});
