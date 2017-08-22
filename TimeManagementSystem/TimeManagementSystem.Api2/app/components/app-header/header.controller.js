(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', HeaderController);

    function HeaderController($state) {
        var vm = this;
        var role = localStorage.getItem("role");

        vm.isAdministrator = role === "Administrator";
        vm.isUserManager = role === "UserManager";
        vm.isRegular = role === "Regular";
        vm.logOut = logOut;

        function logOut() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            $state.transitionTo('anonymous.login');
        }
    }

})();