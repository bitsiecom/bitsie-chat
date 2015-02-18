var bc = angular.module('bc');

bc.factory('bcrypt', function() {
	var bCrypt = {};

	bCrypt.encrypt = function(text){
		var cipher = crypto.createCipher(algorithm,password)
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	}

	bCrypt.decrypt = function(text){
		var decipher = crypto.createDecipher(algorithm,password)
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	}

	return bCrypt;
});
