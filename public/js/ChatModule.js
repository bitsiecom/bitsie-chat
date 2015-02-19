var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', function($scope, room, bcrypt) {

	var passphrase = prompt("Enter your passphrase: ");
	
	var socket = io();
	$scope.messages = [];
	$scope.users = [];
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
		checkUser(people);
		for(var i = 0; i < people.length; i++) {
		}
	});

	function checkUser(user){
		var addToArray = true;
		for(var u = 0; u < $scope.users.length - 1; u++){
			if(user.name == $scope.users[u].name){
				addToArray = false;
			}			
		}
		if(addToArray == true){
			$scope.users.push(user);
		}
	}

	$('#form-chat').submit(function(e) {
		e.preventDefault();
		var msg = bcrypt.encrypt($('#m').val(), passphrase);
		socket.emit('chat message', msg);
		$('#m').val('');
	});

}]);