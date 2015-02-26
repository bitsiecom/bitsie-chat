
var bc = angular.module('bc');
bc.service('modalProvider',['$modal', function ($modal){

	this.openPopupModal= function() {
		var modalInstance = $modal.open({
		      templateUrl: 'introModal.html',
		      keyboard: false,
		      size: size,
		      scope: $scope,
		      windowClass: 'intro-modal'
		    });

		    modalInstance.result.then(function (data) {
		    	$('.modal-backdrop').hide();
		    	//change passphrase on page
		    	//do this without socket
		    	userInfo.setPassphrase(data.passphrase);
		    	socket.emit("update username", data.username);
		    }, function () {
		    	$('.modal-backdrop').hide();
		      $log.info('Modal dismissed at: ' + new Date());
			});
	};
}]);


    	