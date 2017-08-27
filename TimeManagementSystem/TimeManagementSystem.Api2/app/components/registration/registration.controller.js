(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegistrationController', RegistrationController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
        .state('anonymous.register', {
            url: 'register',
            views: {
                'content@': {
                    templateUrl: 'app/components/registration/registration.html',
                    controller: 'RegistrationController as vm'
                },
            }
        });
    }

    function RegistrationController(dataservice, $state) {
        var vm = this;

        vm.login = '';
        vm.password = '';
        vm.confirmPassword = '';
        vm.register = register;

        function register() {
            if (vm.password === vm.confirmPassword) {
                dataservice.register(vm.login, vm.password)
                    .then(function (data) {
                        $state.transitionTo('anonymous.login');
                    });
            } else {
                toastr.error("Passwords are not the same");
            }
        }
    }

})();