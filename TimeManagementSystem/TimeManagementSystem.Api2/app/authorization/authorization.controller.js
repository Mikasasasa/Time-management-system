(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuthorizationController', AuthorizationController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
        .state('app.login', {
            url: 'login',
            views: {
                'header@': {},
                'content@': {
                    templateUrl: 'app/authorization/authorization.html',
                    controller: 'AuthorizationController as vm'
                },
            }
        });
    }

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