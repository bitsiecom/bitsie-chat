describe('BC controllers', function() {
	describe('Controller: ChatController', function(){

		var scope, ctrl, window, room, bcrypt, websocket;

		beforeEach(module('bc'));

		beforeEach(inject(function($rootScope, $controller, _room_, _bcrypt_, $window) {
			scope = $rootScope.$new();
			room = _room_;
			bcrypt = _bcrypt_;
			websocket = function() {
				return {
					on : function() { },
					emit : function() {}
				}
			};
			window = { prompt : function() {} }; // window mock (temporary)
			ctrl = $controller('ChatController', { $scope:scope, room: room, bcrypt: bcrypt,
													websocket: websocket, $window:window });
		}));

		it('should set title', function() {
			//expect(scope.title).toEqual(room.roomId);
		});

	});
});