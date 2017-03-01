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
                    },
                }
            });
    }

    function UsersController($http) {
        var vm = this;

        vm.users = [];
        vm.addUser = addUser;
        vm.editUser = editUser;
        vm.removeUser = removeUser;

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
        };

        function fetchUsersError(data) {
            toastr.error("Unauthorized access.");
        }

        function addUser() {

        }
        
        function editUser(login) {
            alert(login);
        }

        function removeUser(id) {
            alert(id);
        }
    }

    //function UsersViewModel() {
    //    var self = this;
    //    self.users = ko.observableArray();

    //    authenticatedRequest("Users", "get", ko.toJSON(self.user), function (data) {
    //        var responseArray = JSON.parse(data);
    //        for (var i = 0, len = responseArray.length; i < len; ++i) {
    //            self.users.push(responseArray[i]);
    //        }
    //    },
    //    function () {
    //        toastr.error("Unautorized access.");
    //    });
    //    self.addUser = function () {
    //        location.hash = "users/add";
    //    };
    //    self.editUser = function () {
    //        location.hash = "users/edit/" + this.Login;
    //    };
    //    self.removeUser = function () {
    //        if (confirm("Are you sure?")) {
    //            var removedItem = this;
    //            authenticatedRequest("Users/" + removedItem.Id, "delete", {}, function (data) {
    //                self.users.remove(removedItem);
    //                toastr.success("User deleted successfully.");
    //            },
    //            function () {
    //                toastr.error("Unautorized access.");
    //            });
    //        }
    //    };
    //}

})();