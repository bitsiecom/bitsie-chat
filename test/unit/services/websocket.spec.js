describe('BC services', function() {
	describe('Service: bcrypt', function(){

		var websocket;

		beforeEach(module('bc'));

		beforeEach(inject(function (_websocket_) {
			websocket = _websocket_;
		}));

		it('should return socket.io instance', function() {
			expect(websocket).not.toBe(undefined);
		});
	});
});