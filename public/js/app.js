var socket = io();
var room = '1PublicKeyHere';

socket.emit('join', room);

socket.on('chat message', function(user, message) {
	var html = '<strong style="color:' + user.color + '">' + user.name + '</strong>: ' + message;
	$('#messages').append($('<li>').html(html));
});

socket.on('update', function(user, message) {
	var html = '<strong style="color:' + user.color + '">' + user.name + '</strong> ' + message;
	$('#messages').append($('<li>').html(html));
});

socket.on('update people', function(people) {
	for(var i = 0; i < people.length; i++) {
		console.log(people[i]);
	}
});

$('#form-chat').submit(function(e) {
	e.preventDefault();
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
});