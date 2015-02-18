var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', 'websocket', '$window', 
	function($scope, room, bcrypt, websocket, $window) {

	var passphrase = $window.prompt("Enter your passphrase: ");
	
	var socket = websocket();
	$scope.messages = [];
	socket.emit('join', room.id);

	socket.on('chat message', function(user, message) {
		var decrypted = bcrypt.decrypt(message, passphrase);
		if (message && !decrypted) decrypted = '[unable to decrypt message -- verify passphrase]';
		$scope.$apply(function(){
			$scope.messages.push({user: user, message: decrypted});
		});
	});

	socket.on('update', function(user, message) {	
		$scope.$apply(function(){
			$scope.messages.push({user: user, message: message});
		});
	});

	socket.on('update people', function(people) {
		for(var i = 0; i < people.length; i++) {
			console.log(people[i]);
		}
	});

	$('#form-chat').submit(function(e) {
		e.preventDefault();
		var msg = bcrypt.encrypt($('#m').val(), passphrase);
		socket.emit('chat message', msg);
		$('#m').val('');
	});

}]);