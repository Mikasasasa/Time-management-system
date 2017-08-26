(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
            .state('app.users.add', {
                url: '/add',
                views: {
                    'content@': {
                        templateUrl: 'app/components/users/edit/user.html',
                        controller: 'UserController as vm'
                    }
                }
            })
            .state('app.users.edit', {
                url: '/edit/:login',
                views: {
                    'content@': {
                        templateUrl: 'app/components/users/edit/user.html',
                        controller: 'UserController as vm'
                    }
                }
            });
    }

    function UserController($http, $stateParams, $state) {
        var vm = this;

        vm.user = null;
        vm.saveMethod = null;
        vm.saveMethodName = null;
        vm.isAddingMode = true;
        vm.isAdministrator = localStorage.getItem("role") === "Administrator";
        vm.passwordRepeat = '';
        vm.permissionLevels = [{ name: "regular", value: 0 }, { name: "user manager", value: 1 }, { name: "administrator", value: 2 }];
        vm.selectedPermissionLevel = vm.permissionLevels[0];

        setUser();

        function setUser() {
            var userLogin = $stateParams.login;
            if (userLogin !== undefined) {
                $http({
                    method: "GET",
                    url: '/api/Users',
                    params: { userName: userLogin }
                })
                .then(function (data) {
                    vm.user = data.data;
                    setPermissionLevel(vm.user.PermissionLevel);
                    vm.saveMethod = editUser;
                    vm.saveMethodName = "save";
                    vm.isAddingMode = false;
                });
            } else {
                vm.user = {
                    Login: null,
                    Password: null,
                    PermissionLevel: 0,
                    PreferredWorkingHourPerDay: null
                };
                vm.saveMethod = addUser;
                vm.saveMethodName = "add";
            }
        }

        function addUser() {
            vm.user.PermissionLevel = vm.selectedPermissionLevel.value;
            $http({
                method: "POST",
                url: '/api/Users',
                data: vm.user
            })
            .then(function (data) {
                toastr.success("User added successfully.");
                $state.transitionTo('app.users.edit', { login: vm.user.Login });
            });
        }

        function editUser(login) {
            vm.user.PermissionLevel = vm.selectedPermissionLevel.value;
            //@todo: check if passwords are the same
            $http({
                method: "PUT",
                url: '/api/Users',
                params: { id: vm.user.Id },
                data: vm.user
            })
            .then(function (data) {
                toastr.success("User updated successfully.");
                $state.transitionTo('app.users.edit', { login: vm.user.Login });
            });
        }

        function setPermissionLevel(permissionLevel) {
            for (var i = 0; i < vm.permissionLevels.length; ++i) {
                var item = vm.permissionLevels[i];
                if (item.value === permissionLevel) {
                    vm.selectedPermissionLevel = item;
                    break;
                }
            }
        }
    }
})();