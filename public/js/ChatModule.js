var bc = angular.module('bc');

bc.controller('ChatController', ['$scope', 'room', 'bcrypt', 'websocket', '$window', '$modal', '$log',
	function($scope, room, bcrypt, websocket, $window, $modal, $log) {

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
		})
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
		socket.emit("update passphrase", passphrase);
	}

	 //open a modal when the user comes to the page to enter in the encryption passphrase
	 this.openModal = function (size) {

    	var modalInstance = $modal.open({
	      templateUrl: 'introModal.html',
	      controller: 'ModalInstanceCtrl',
	      keyboard: false,
	      size: size,
	      scope: $scope,
	      windowClass: 'intro-modal'
	    });

	    modalInstance.result.then(function (data) {
	    	$('.modal-backdrop').hide();
	    	socket.emit("update username", data.username);
	    	socket.emit("update passphrase", data.passphrase);
	    }, function () {
	    	socket.emit("update passphrase", "");
	    	$('.modal-backdrop').hide();
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  this.openModal("large");

}]);

//controller for angular modal when first entering room
 bc.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  	$scope.startChat = function(passphraseInput, username){
  		var data = {"passphrase" : passphraseInput, "username": username};
  		//pass the passphrase ander username into controller result on close
  		$modalInstance.close(data);
  	};

  	$scope.dismiss
  	
});

