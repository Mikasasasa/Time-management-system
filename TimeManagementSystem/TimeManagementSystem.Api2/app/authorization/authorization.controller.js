(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuthorizationController', AuthorizationController);

    function AuthorizationController(dataservice) {
        var vm = this;

        vm.login = '';
        vm.password = '';
        vm.logIntoApp = logIntoApp;

        function logIntoApp() {
            return dataservice.loginIntoApp(vm.login, vm.password)
        }
    }

})();