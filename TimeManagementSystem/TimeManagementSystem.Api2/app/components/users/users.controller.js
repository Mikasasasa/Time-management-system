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
                        templateUrl: 'app/components/authorization/authorization.html',
                        controller: 'UsersController as vm'
                    },
                }
            });
    }

    function UsersController(dataservice) {
        var vm = this;

        vm.users = [];

        fetchUsers();

        function fetchUsers() {
            return dataservice.request("Users", "GET", {}, fetchUsersSuccess, fetchUsersError);
        }

        function fetchUsersSuccess(data) {
            vm.users = data;
        };

        function fetchUsersError(data) {
            toastr.error("Unauthorized access.");
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