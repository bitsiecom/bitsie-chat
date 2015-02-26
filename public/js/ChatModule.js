var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', 'websocket', 'userInfo', 'modalProvider', '$window', '$modal', '$log',
	function($scope, room, bcrypt, websocket, userInfo, modalProvider, $window, $modal, $log) {

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

	socket.on('chat message', function(user, message) {
		var decrypted = bcrypt.decrypt(message, $scope.passphrase);
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
		});
	});

	$('#form-chat').submit(function(e) {
		e.preventDefault();
		var msg = bcrypt.encrypt($('#m').val(), $scope.passphrase);
		socket.emit('chat message', msg);
		$('#m').val('');
	});

	$(".encryption").click(function(e){
		e.preventDefault();
		$(this).toggleClass("active");
	});

	$scope.updatePassphrase = function(passphrase){
		userInfo.setPassphrase(passphrase);
		$scope.passphrase = passphrase;
	};

	modalProvider.openPopupModal("large");
	 //open a modal when the user comes to the page to enter in the encryption passphrase

}]);



 bc.controller('ModalInstanceController', function ($scope, $modalInstance) {
  	$scope.startChat = function(passphraseInput, username){
  		//pass the passphrase ander username into controller result on close
  		var data = {"passphrase" : passphraseInput, "username": username};
  		$modalInstance.close(data);
  	};
  	
});

