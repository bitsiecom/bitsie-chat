var bc = angular.module('bc');

bc.factory('bcrypt', function() {

	var bCrypt = {};

	bCrypt.encrypt = function(text, passphrase) {
		return CryptoJS.AES.encrypt(text, passphrase).toString();
	};

	bCrypt.decrypt = function(encrypted, passphrase) {
		return CryptoJS.AES.decrypt(encrypted, passphrase).toString(CryptoJS.enc.Utf8);
	};

	return bCrypt;
});
