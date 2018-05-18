$(document).ready(function(){
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/javascript");

	var editor_3d = ace.edit("intermediate-editor");
	editor_3d.setTheme("ace/theme/monokai");
	editor_3d.session.setMode("ace/mode/javascript");
});
