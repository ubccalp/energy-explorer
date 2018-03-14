$(document).ready(function() {
	/*
	* Internal use of the demo website
	*/
	$('#showExamples').click(function(e){
		console.log("va");
		e.stopPropagation();
		e.preventDefault();
		$('#examplesList').toggle();
	});

	$('html').click(function(){
		$('#examplesList').hide();
	});

});