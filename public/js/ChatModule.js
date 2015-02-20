var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', 'websocket', '$window', 
	function($scope, room, bcrypt, websocket, $window) {

	var passphrase = 'test';

	$("#intro-modal").modal('show');
	
	var socket = websocket();
	$scope.messages = [];
	$scope.people = [];
	$scope.passphrase = passphrase;
	socket.emit('join', room.id);

	socket.on('update passphrase', function(passphrase){
		$scope.$apply(function(){
			console.log("applying");
			$scope.passphrase = passphrase;
		});
	});

	socket.on('chat message', function(user, message) {
		console.log("hits");
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
		$scope.$apply(function(){
			$scope.people = people;	
		})
	});

	$('#form-chat').submit(function(e) {
		e.preventDefault();
		var msg = bcrypt.encrypt($('#m').val(), passphrase);
		socket.emit('chat message', msg);
		$('#m').val('');
	});

	$(".encryption").click(function(e){
		e.preventDefault();
		$(".encryption-menu").toggle();
		$(this).toggleClass("active");
	});

	$(".encryption-submit").click(function(e){
		socket.emit("update passphrase", $(".passphrase-input").val());
		$(".encryption-menu").toggle();
	});

	 $(".passphrase-submit").click(function(e){
	 	console.log("submitted");
		socket.emit("update passphrase", $(".intro-passphrase").val());
		$("#intro-modal").hide();
	}); 

}]);