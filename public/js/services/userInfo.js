var bc = angular.module('bc');
bc.service('userInfo', ['$window', function () {
    
    var passphrase = '';

    return {
        getPassphrase: function () {
            return passphrase;
        },
        setPassphrase: function(passphrase) {
            passphrase = passphrase;
        }
    };
}]);