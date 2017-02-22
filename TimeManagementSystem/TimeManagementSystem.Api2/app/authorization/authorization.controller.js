(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuthorizationController', AuthorizationController);

    AuthorizationController.$inject = ['dataservice'];

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