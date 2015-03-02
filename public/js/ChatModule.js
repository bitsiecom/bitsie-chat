var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', 'websocket', '$timeout', '$window', '$log',
	function($scope, room, bcrypt, websocket, $timeout, $window, $log) {

	var socket = websocket();

	$scope.messages = [];
	$scope.people = [];
	$scope.passphrase = "";
	$scope.username = "";


	socket.emit('join', room.id);	

	socket.on('update passphrase', function(passphrase){
		$scope.$apply(function(){
			$scope.passphrase = passphrase;
		});
	}); 

	socket.on('start name', function(name){
		console.log(name);
		$scope.$apply(function(){
			$scope.username = name;
		});
	}); 

	socket.on('chat message', function(user, message) {
		var decrypted = bcrypt.decrypt(message, $scope.passphrase);
		if (message && !decrypted) decrypted = '[unable to decrypt message -- verify passphrase]';
		$scope.$apply(function(){
			$scope.messages.push({user: user, message: decrypted});
			$timeout(function(){
				var messageBox = $("#messages");
				messageBox.scrollTop(messageBox.prop("scrollHeight"));
			});
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
		});
	});

	$scope.sendMessage = function() {
		if($scope.message){
			var msg = bcrypt.encrypt($scope.message, $scope.passphrase);
			socket.emit('chat message', msg);
		}
		$scope.message = "";	
	};

	//modalProvider.openPopupModal("large");
	$scope.startChat = function(passphraseInput, username){
  		//pass the passphrase ander username into controller result on close
  		var data = {"passphrase" : passphraseInput, "username": username};
  		$timeout(function(){
  			$scope.$apply(function(){
  				$scope.passphrase = passphraseInput;
  				socket.emit('update username', username);
  			});
  		});
  		$(".intro-modal-container").fadeOut();
  		$("body").css("background", "white");
  		$("#form-chat").fadeIn();
  	};

	$timeout(function(){
		$scope.$apply(function(){
			$scope.showModal =  true;
		});
	});

	
	
}]);



