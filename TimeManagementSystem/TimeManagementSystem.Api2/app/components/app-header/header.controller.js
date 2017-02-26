(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', HeaderController);

    function HeaderController($state) {
        var vm = this;

        vm.logOut = logOut;

        function logOut() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            $state.transitionTo('anonymous.login');
        }
    }

})();