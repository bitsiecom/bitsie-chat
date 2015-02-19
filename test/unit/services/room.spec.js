describe('BC services', function() {

	beforeEach(module('bc'));

	describe('Service: room (new)', function(){
		beforeEach(module(function($provide) {
			$provide.value('$window', {
				location : {
					hash : ''
				}
			});
		}));

		it('should create room if not provided', inject(function(room) {
			expect(room.id).not.toBe(undefined);
		}));
	});

	describe('Service: room (existing)', function(){
		beforeEach(module(function($provide) {
			$provide.value('$window', {
				location : {
					hash : '#foobar'
				}
			});
		}));

		it('should not create room if already provided', inject(function(room) {
			expect(room.id).toEqual('foobar');
		}));
	});
});