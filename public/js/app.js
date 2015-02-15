// @todo: replace with public/private key pair
function createRoom()
{
	// generate new room id
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	window.location.hash = text;
	return text;
}

var socket = io();
var roomId = window.location.hash.replace("#", "");
if (!roomId) {
	roomId = createRoom();
}
socket.emit('join', roomId);

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