var bc = angular.module('bc');

bc.factory('websocket', [function() {
	return io;
}]);
