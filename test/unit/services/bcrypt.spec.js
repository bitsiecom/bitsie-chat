describe('BC services', function() {
	describe('Service: bcrypt', function(){

		var bcrypt;

		beforeEach(module('bc'));

		beforeEach(inject(function (_bcrypt_) {
			bcrypt = _bcrypt_;
		}));

		it('should encrypt and decrypt string', function() {
			var encrypted = bcrypt.encrypt('hello world!', 'mypassword');
			expect(encrypted).not.toEqual("");

			var decrypted = bcrypt.decrypt(encrypted, 'mypassword');
			expect(decrypted).toEqual("hello world!");

		});
	});
});