var socket = io();

socket.on('chat message', function(msg) {
	$('#messages').append($('<li>').text(msg));
});

$('#form-chat').submit(function(e) {
	e.preventDefault();
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
});