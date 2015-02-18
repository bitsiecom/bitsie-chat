var bc = angular.module('bc');

bc.factory('room', ['$location', function($location) {

	var room = {};

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

	var roomId = window.location.hash.replace("#", "");
	if (!roomId) {
		roomId = createRoom();
	}

	return {
		id : roomId
	};

}]);
