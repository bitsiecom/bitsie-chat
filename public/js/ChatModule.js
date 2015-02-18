var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'bcrypt', function($scope, bcrypt) {

	var socket = io();
	$scope.messages = [];
	socket.emit('join', roomId);
	socket.on('chat message', function(user, message) {
		$scope.$apply(function(){
			$scope.messages.push({user: user, message: message});
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
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
	});

}]);