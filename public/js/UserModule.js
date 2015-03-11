var bc = angular.module('bc');

bc.controller('UserController', ['$scope', 
	function($scope) {

		$scope.username = "";
		$scope.password = "";

		$scope.registerUser = function(username, password){
			console.log(username);
			console.log(password);
			$scope.user = [{username: username, password: password}];
		}
}]);