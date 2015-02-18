var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', function($scope, room, bcrypt) {

	var passphrase = "The Monkey kicked the Unicorn and caused a Ri0t in the streets.";
	
	var decrypt = function(msg) {
		var decrypted;
		try {
			decrypted = bcrypt.decrypt(msg, passphrase);
		} catch(ex) {
			decrypted = '[unable to decrypt message -- verify your passphrase]';
		}
		return decrypted;
	}

	var socket = io();
	$scope.messages = [];
	socket.emit('join', room.id);
	socket.on('chat message', function(user, message) {
		console.log('chat msg');
		$scope.$apply(function(){
			$scope.messages.push({user: user, message: decrypt(message)});
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