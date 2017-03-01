(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuthorizationController', AuthorizationController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
        .state('anonymous.login', {
            url: 'login',
            views: {
                'content@': {
                    templateUrl: 'app/components/authorization/authorization.html',
                    controller: 'AuthorizationController as vm'
                },
            }
        });
    }

    function AuthorizationController(dataservice, $state) {
        var vm = this;

        vm.login = '';
        vm.password = '';
        vm.logIntoApp = logIntoApp;

        function logIntoApp() {
            dataservice.loginIntoApp(vm.login, vm.password).then(function (data) {
                $state.transitionTo('app.home');
            });
        }
    }

})();