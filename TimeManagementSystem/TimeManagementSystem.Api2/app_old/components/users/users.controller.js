(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersController', UsersController)
        .config(stateProviderConfig);

    function stateProviderConfig($stateProvider) {
        $stateProvider
            .state('app.users', {
                abstract: true,
                url: 'users'
            })
            .state('app.users.list', {
                url: '',
                views: {
                    'content@': {
                        templateUrl: 'app/components/users/users.html',
                        controller: 'UsersController as vm'
                    }
                }
            });
    }

    function UsersController($http, $state) {
        var vm = this;

        vm.users = [];
        vm.addUser = addUser;
        vm.editUser = editUser;
        vm.removeUser = removeUser;
        vm.gridOptions = {
            columnDefs: [
                { field: 'Login', displayName: 'Login' },
                { field: 'PermissionLevel', displayName: 'Permission level' },
                { field: 'PreferredWorkingHourPerDay', displayName: 'Preferred working hour per day' },
                { name: 'Actions', cellTemplate: '<div class="ui-grid-cell-contents" ><button class="btn btn-xs btn-success" ng-click="grid.appScope.editUser(row.entity.Login)">Edit</button><button class="btn btn-xs btn-danger" ng-click="grid.appScope.removeUser(row.entity)">Remove</button></div>' }
            ],
            appScopeProvider: vm
        };

        fetchUsers();

        function fetchUsers() {
            $http({
                method: "GET",
                url: '/api/Users'
            })
            .then(function (data) {
                fetchUsersSuccess(data);
            })
            .catch(function (data) {
                fetchUsersError(data);
            });
        }

        function fetchUsersSuccess(data) {
            vm.users = data.data;
            vm.gridOptions.data = vm.users;
        }

        function fetchUsersError(data) {
            toastr.error("Unauthorized access.");
        }

        function addUser() {
            $state.transitionTo('app.users.add');
        }

        function editUser(login) {
            $state.transitionTo('app.users.edit', { login: login });
        }

        function removeUser(user) {
            if (confirm("Are you sure?")) {
                $http({
                    method: "DELETE",
                    url: '/api/Users/' + user.Id
                })
                    .then(function (data) {
                        var index = vm.users.indexOf(user);
                        vm.users.splice(index, 1);
                        toastr.success("User deleted successfully.");
                    })
                    .catch(function (data) {
                        toastr.error("Unautorized access.");
                    });
            }
        }
    }
})();