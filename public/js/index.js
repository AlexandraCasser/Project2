$(function() {

	// Event listener for drop-down menu change
	$('#dataset-select').change(function(){
		document.location.href="/users/" + $('#dataset-select').val();
	});

});
